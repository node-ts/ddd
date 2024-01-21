// tslint:disable:max-classes-per-file
import { AggregateRoot } from '../domain'
import { AggregateRootProperties } from '@node-ts/ddd-types'
import { WriteRepository } from './write-repository'
import { WriteModel } from './write-model'
import { Mock, IMock, It, Times } from 'typemoq'
import { EntityManager, Connection, Repository } from 'typeorm'
import { Logger } from '@node-ts/logger-core'
import { Event } from '@node-ts/bus-messages'
import { DeletingNewAggregate } from './error'
import { BusInstance as Bus } from '@node-ts/bus-core'

interface UserProperties extends AggregateRootProperties {
  name: string
  email: string
}

class UserPurged extends Event {
  static NAME = 'node-ts/ddd/user-purged'
  $name = UserPurged.NAME
  $version = 0
}

class UserRegistered extends Event {
  static NAME = 'node-ts/ddd/user-registered'
  $name = UserRegistered.NAME
  $version = 0
}

class UserPasswordChanged extends Event {
  static NAME = 'node-ts/ddd/user-password-changed'
  $name = UserPasswordChanged.NAME
  $version = 0
}

class User extends AggregateRoot implements UserProperties {
  name: string
  email: string

  static register (id: string): User {
    const user = new User(id)
    const userRegistered = new UserRegistered()
    user.when(userRegistered)
    return user
  }

  changePassword (): void {
    this.when(new UserPasswordChanged())
  }

  purge (): void {
    const userPurged = new UserPurged()
    this.delete(userPurged)
  }

  protected whenUserRegistered (_: UserRegistered): void {
    // ...
  }

  protected whenUserPasswordChanged (_: UserPasswordChanged): void {
    // ...
  }
}

class UserWriteModel extends WriteModel implements UserProperties {
  name: string
  email: string
}

class UserWriteRepository extends WriteRepository<User, UserWriteModel> {
}

describe('WriteRepository', () => {
  let sut: WriteRepository<User, UserWriteModel>
  let connection: IMock<Connection>
  let repository: IMock<Repository<UserWriteModel>>
  let bus: IMock<Bus>

  beforeEach(() => {
    repository = Mock.ofType<Repository<UserWriteModel>>()
    connection = Mock.ofType<Connection>()
    connection
      .setup(c => c.getRepository(UserWriteModel))
      .returns(() => repository.object)

    bus = Mock.ofType<Bus>()

    sut = new UserWriteRepository(
      User,
      UserWriteModel,
      connection.object,
      bus.object,
      Mock.ofType<Logger>().object
    )
  })

  describe('when retrieving an aggregate from the data store', () => {
    let user: User
    let writeModel: UserWriteModel

    beforeEach(async () => {
      writeModel = new UserWriteModel()
      writeModel.id = '1'
      writeModel.name = 'name'
      writeModel.email = 'email'

      repository
        .setup(async r => r.findOneBy({ id: writeModel.id }))
        .returns(async () => writeModel)

      user = await sut.getById(writeModel.id)
    })

    it('should map the model to an aggregate', () => {
      expect(user).toMatchObject({
        id: writeModel.id,
        name: writeModel.name,
        email: writeModel.email
      })
      // tslint:disable-next-line:no-unbound-method Not invoking, just checking presence of
      expect(user.changePassword).toBeDefined()
    })
  })

  describe('when saving an aggregate root', () => {
    let entityManager: IMock<EntityManager>
    let user: User

    beforeEach(() => {
      entityManager = Mock.ofType<EntityManager>()
      connection
        .setup(async c => c.transaction(It.isAny()))
        .callback(async unitOfWork => unitOfWork(entityManager.object))

      user = User.register('2')
    })

    describe('and the aggregate is newly created', () => {
      beforeEach(async () => {
        await sut.save(user)
      })

      it('should invoke `save` on the orm', () => {
        entityManager.verify(
          async e => e.save(It.isAny()),
          Times.once()
        )
      })

      it('should publish changes to the domain object', () => {
        bus.verify(
          b => b.publish(It.isObjectWith<UserRegistered>({ $name: UserRegistered.NAME })),
          Times.once()
        )
      })
    })

    describe('and the aggregate is updated', () => {
      beforeEach(async () => {
        user.clearChanges()
        user.changePassword()
        await sut.save(user)
      })

      it('should invoke `save` on the orm', () => {
        entityManager.verify(
          async e => e.save(It.isAny()),
          Times.once()
        )
      })

      it('should publish changes to the domain object', () => {
        bus.verify(
          b => b.publish(It.isObjectWith<UserPasswordChanged>({ $name: UserPasswordChanged.NAME })),
          Times.once()
        )
      })
    })
  })

  describe('when deleting an aggregate', () => {
    describe('that was never saved', () => {
      let entityManager: IMock<EntityManager>
      beforeEach(() => {
        entityManager = Mock.ofType<EntityManager>()
        connection
          .setup(async c => c.transaction(It.isAny()))
          .callback(async unitOfWork => unitOfWork(entityManager.object))
      })

      it('should throw a DeletingNewAggregate error', async () => {
        const newUser = new User('a')
        newUser.purge()
        await expect(sut.save(newUser)).rejects.toBeInstanceOf(DeletingNewAggregate)
      })
    })

    describe('that was previously saved', () => {
      let entityManager: IMock<EntityManager>
      let user: User

      beforeEach(async () => {
        entityManager = Mock.ofType<EntityManager>()
        connection
          .setup(async c => c.transaction(It.isAny()))
          .callback(async unitOfWork => unitOfWork(entityManager.object))

        user = new User('2')
        Object.assign(user, { fetchVersion: 1 })
        user.purge()

        await sut.save(user)
      })

      it('should delete the entity', () => {
        entityManager.verify(
          async e => e.delete(It.isAny(), user.id),
          Times.once()
        )
      })
    })
  })
})
