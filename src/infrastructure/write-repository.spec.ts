// tslint:disable:max-classes-per-file
import { AggregateRoot, AggregateRootProperties } from '../domain'
import { WriteRepository } from './write-repository'
import { WriteModel } from './write-model'
import { Uuid } from '../shared'
import { Mock, IMock, It, Times } from 'typemoq'
import { EntityManager, Connection, Repository } from 'typeorm'

interface UserProperties extends AggregateRootProperties {
  name: string
  email: string
}

class User extends AggregateRoot implements UserProperties {
  name: string
  email: string

  changePassword (): void {
    // NOOP
  }
}

class UserWriteModel extends WriteModel implements UserProperties {
  name: string
  email: string
}

class UserWriteRepository extends WriteRepository<User, UserWriteModel> {
  async getById (_: Uuid): Promise<User> {
    const model = new UserWriteModel()
    model.name = 'name'
    model.email = 'email'
    return this.toAggregateRoot(model)
  }

  async save (_: User): Promise<void> {
    // NOOP
  }
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
      connection.object
    )
  })

  describe('when retrieving an aggregate from the data store', () => {
    let user: User
    beforeEach(async () => {
      user = await sut.getById('1')
    })

    it('should map the model to an aggregate', () => {
      expect(user).toBeDefined()
      expect(user.changePassword).toBeDefined()
    })
  })

  describe('when saving an aggregate root', () => {
    let entityManager: IMock<EntityManager>
    let user: User
    beforeEach(() => {
      connection
        .setup(async c => c.transaction(It.isAny()))
        .callback(async unitOfWork => unitOfWork(entityManager.object))

      user = new User('2')
      entityManager = Mock.ofType<EntityManager>()
    })

    describe('and the aggregate is newly created', () => {
      fit('should invoke `save` on the orm', async () => {
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
})
