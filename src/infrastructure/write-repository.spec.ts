// tslint:disable:max-classes-per-file
import { AggregateRoot, AggregateRootProperties } from '../domain'
import { WriteRepository } from './write-repository'
import { WriteModel } from './write-model'
import { Mock, IMock, It, Times } from 'typemoq'
import { EntityManager, Connection, Repository } from 'typeorm'
import { Logger } from '@node-ts/logger-core'
import { Event } from '@node-ts/bus-messages'
import { DeletingNewAggregate } from './error';

interface UserProperties extends AggregateRootProperties {
  name: string
  email: string
}

class UserPurged extends Event {
  $name = 'node-ts/ddd/user-purged'
  $version = 0
}

class User extends AggregateRoot implements UserProperties {
  name: string
  email: string

  changePassword (): void {
    // NOOP
  }

  purge (): void {
    const userPurged = new UserPurged()
    this.delete(userPurged)
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

  beforeEach(() => {
    repository = Mock.ofType<Repository<UserWriteModel>>()
    connection = Mock.ofType<Connection>()
    connection
      .setup(c => c.getRepository(UserWriteModel))
      .returns(() => repository.object)

    sut = new UserWriteRepository(
      User,
      UserWriteModel,
      connection.object,
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
        .setup(async r => r.findOne(writeModel.id))
        .returns(async () => writeModel)

      user = await sut.getById(writeModel.id)
    })

    it('should map the model to an aggregate', () => {
      expect(user).toMatchObject({
        id: writeModel.id,
        name: writeModel.name,
        email: writeModel.email
      })
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

      user = new User('2')
    })

    describe('and the aggregate is newly created', () => {
      it('should invoke `save` on the orm', async () => {
        await sut.save(user)
        entityManager.verify(
          async e => e.save(It.isAny()),
          Times.once()
        )
      })
    })

    describe('and the aggregate is updated', () => {
      it('should invoke `save` on the orm', async () => {
        await sut.save(user)
        entityManager.verify(
          async e => e.save(It.isAny()),
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
