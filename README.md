# @node-ts/ddd

[![Greenkeeper badge](https://badges.greenkeeper.io/node-ts/ddd.svg)](https://greenkeeper.io/)

Domain driven design (DDD) is an approach to software design that values simplicity and modeling code as closely to the business domain as possible. This results in code that can be easily understood by the business and evolved as the needs of the business domain change.

By isolating domain code away from all other concerns of the system like infrastructure, security, transportation, serialization etc; the complexity of the system grows only as large as the complexity of the business or problem domain itself.

If you are new to the concepts of DDD, it's highly recommended to do some background reading to grasp the motivations for this approach and to decide if it suits your application.

If you have already decided to use DDD for your application, this package is part of suite of purpose-built libraries that help you and your teams write large distributed node applications that are maintainable and easy to change.

## Installation

Install the `@node-ts/ddd` package and its dependencies:

```sh
npm i @node-ts/ddd @node-ts/logger-core @node-ts/bus-core @node-ts/bus-messages inversify --save
```

## Layers

This library encourages layering code using the onion architecture approach. The main two layers that this libray provides helpers for are the domain and application layers outlined below. 

## Domain layer

The domain layer sits at the centre of the system. It contains domain objects and domain services. This layer has no technical concerns like infrastructure, authentication, data access etc. The goal of the domain layer is to have a place in your application where code can be writen that models your business domains and rules in a way where those business complexities are kept separate from the rest of your application.

As a result, much of the code that gets written in this layer can be read by non-technical staff meaning that greater collaboration with the domain experts and validation of expected behaviours can be performed. Code here is easily unit testable and isolated from the rest of the application. 

The domain layer is composed of one or more **domains**. Domains are logical boundaries around broad groups of related logic. Each domain is comprised of multiple **aggregates**, which are clusters of closely related data that model a single entity in the real world. Each aggregate has a **root**, that represents the single point of access into an aggregate and hosts all the actions that can be performed.

A simple example is a user of a website. In this example an "account" domain is established to encapsulate all aspects of user accounts, billing, profiles, contact details, etc. Users can perform the following actions:

* `register()` an account
* `changePassword()`
* `disable()` their account

We can model that these actions have occured using bus `Events` (see [Bus Messages](https://node-ts.github.io/bus/packages/bus-messages/#event) for more details). Here are the events for those actions:

```typescript
// user-registered.ts
import { Event } from '@node-ts/bus-messages'
import { Uuid } from '@node-ts/ddd'

export class UserRegistered extends Event {
  static readonly NAME = 'org/account/user-registered'
  $name = UserRegistered.NAME
  $version = 0

  /**
   * A user has registered with the website
   * @param userId Identifies the user who registered
   * @param email used to register the user
   * @param isEnabled if the user can log in with this account
   */
  constructor (
    readonly userId: Uuid,
    readonly email: string
    readonly isEnabled: boolean
  ) {
  }
}
```

```typescript
// user-password-changed.ts
import { Event } from '@node-ts/bus-messages'
import { Uuid } from '@node-ts/ddd'

export class UserPasswordChanged extends Event {
  static readonly NAME = 'org/account/user-password-changed'
  $name = UserPasswordChanged.NAME
  $version = 0

  /**
   * A user has changed their password
   * @param userId Identifies the user who changed their password
   * @param passwordChangedAt when the password was changed
   */
  constructor (
    readonly userId: Uuid,
    readonly passwordChangedAt: Date
  ) {
  }
}
```

```typescript
// user-disabled.ts
import { Event } from '@node-ts/bus-messages'
import { Uuid } from '@node-ts/ddd'

export class UserDisabled extends Event {
  static readonly NAME = 'org/account/user-disabled'
  $name = UserDisabled.NAME
  $version = 0

  /**
   * A user has disabled their account
   * @param userId Identifies the user who changed their password
   * @param isEnabled if the user can log in to their account
   */
  constructor (
    readonly userId: Uuid,
    readonly isEnabled: boolean
  ) {
  }
}
```

These events above are broadcasted to the rest of your system, normally with a message bus, each time one of the actions are performed on the aggregate root. 

The following is an example implementation of the `User` domain object:

```typescript
// user.ts
import { AggregateRootProperties, AggregateRoot, Uuid } from '@node-ts/ddd'
import { UserRegistered, UserPasswordChanged, UserDisabled } from './events'
import { OAuthService } from './services'

export interface UserProperties extends AggregateRootProperties {
  email: string
  isEnabled: boolean
  passwordChangedAt: Date | undefined
}

export class User extends AggregateRoot implements UserProperties {
  email: string
  isEnabled: boolean
  passwordChangedAt: Date | undefined

  // Creation static method. Aggregates are never "newed" up by consumers.
  static register (id: Uuid, email: string): User {
    const userRegistered = new UserRegistered(
      id,
      email,
      true
    )

    const user = new User(id)
    // event is applied to the user object
    user.when(userRegistered)
    return user
  }

  /**
   * Changes the user's password that's used to log in to the site
   * @param oauthService the oauth service that hosts the user account
   * @param newPassword password the user wants to use
   */
  async changePassword (oauthService: OAuthService, newPassword: string): Promise<void> {
    // A domain service is used to perform the actual change of password
    await oauthService.changePassword(this.id, newPassword)

    const userPasswordChanged = new UserPasswordChanged(
      this.id,
      new Date()
    )
    super.when(userPasswordChanged)
  }

  /**
   * Disable the user account so they can no longer log in
   */
  disable (): void {
    const userDisabled = new UserDisabled(this.id, false)
    super.when(userDisabled)
  }
  
  protected whenUserRegistered (event: UserRegistered): void {
    this.email = event.email
    this.isEnabled = event.isEnabled
  }

  protected whenPasswordChanged (event: UserPasswordChanged): void {
    this.passwordChangedAt = event.passwordChangedAt
  }

  protected whenUserDisabled (event: UserDisabled): void {
    this.isEnabled = event.isEnabled
  }
}
```

This approach to modeling the business domain is well documented. It's clear what actions a user can perform, what the business rules are those actions, and what data updates as a result.

Each time an action method is called on a domain objecft, an event is prepared and applied to the `when()` protected method. This method does a number of things:

* It adds the event into the list of new changes made to the aggregate
* It increments the verison of the aggregate as data has now changed
* It invokes the method named `when<EventName>` on the aggregate (eg: `whenUserRegistered`)

At this point it's important to note that the aggregate has not been persisted nor the event published to the bus. This will be the responsibility of the application server that initially invoked the domain action.

### Application layer

The application layer sits around the domain layer. It provides services that act as a gateway to performing actions against the domain. Broadly speaking, these services typically offer one method per command, and can retrieve domain objects from persistence, query other necessary data inputs, gather dependencies to inject and persist data back to the database.

The following `UserService` provides operations that modify the `User` domain object. Note that once an operation has been performed on the domain object, it is persisted via its write repository. This operation will store the updated object in the database as well as publishing any events to the bus.

```typescript
// user-service.ts
import { injectable, inject } from 'inversify'
import { OAuthService } from './services'
import { RegisterUser, ChangePasswordForUser, DisableUser } from './commands'

@injectable()
export class UserService {
  constructor (
    @inject(ACCOUNT_SYMBOLS.UserWriteRepository)
      private readonly userWriteRepository: UserWriteRepository,
    @inject(ACCOUNT_SYMBOLS.OAuthService)
      private readonly oauthService: OAuthService
  ) {
  }

  async register ({ id, email }: RegisterUser): Promise<void> {
    const user = User.register(id, email)
    await this.userWriteRepository.save(user)
  }

  async changePassword ({ id, newPassword }: ChangePasswordForUser): Promise<void> {
    const user = await this.userWriteRepository.getById(id)
    await user.changePassword(this.oauthService, newPassword)
    await this.userWriteRepository.save(user)
  }

  async disable ({ id }: DisableUser): Promise<void> {
    const user = await this.userWriteRepository.getById(id)
    await user.disable()
    await this.userWriteRepository.save(user)
  }
}
```

The `UserWriteRepository` injected into the above service comes from the following class definition. The in-built `WriteRepository<>` is a wrapper around TypeORM that provides the ability to write to different types of databases as well as sending domain object change events to the bus.

```typescript
// user-write-repository.ts
import { injectable, inject } from 'inversify'
import { Connection } from 'typeorm'
import { LOGGER_SYMBOLS, Logger } from '@node-ts/logger-core'

@injectable()
export class UserWriteRepository extends WriteRepository<User, UserWriteModel> {
  constructor (
    @inject(SHARED_SYMBOLS.DatabaseConnection) databaseConnection: Connection,
    @inject(LOGGER_SYMBOLS.Logger) logger: Logger
  ) {
    super(User, UserWriteModel, databaseConnection, logger)
  }
}
```