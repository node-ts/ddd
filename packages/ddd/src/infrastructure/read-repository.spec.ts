// tslint:disable:max-classes-per-file

import { Model } from './model'
import { ReadRepository } from './read-repository'
import { DataSource, Repository } from 'typeorm'
import { IMock, Mock } from 'typemoq'
import { EntityNotFound } from './error'

class UserModel extends Model {
}

class UserReadRepository extends ReadRepository<UserModel> {
  constructor (connection: DataSource) {
    super(
      connection,
      UserModel
    )
  }
}

describe('ReadRepository', () => {
  let sut: ReadRepository<UserModel>
  let connection: IMock<DataSource>
  let repository: IMock<Repository<UserModel>>

  beforeEach(() => {
    connection = Mock.ofType<DataSource>()
    repository = Mock.ofType<Repository<UserModel>>()

    connection
      .setup(c => c.getRepository(UserModel))
      .returns(() => repository.object)

    sut = new UserReadRepository(connection.object)
  })

  describe('when getting by id', () => {
    let user: UserModel

    beforeEach(() => {
      user = new UserModel()
      user.id = 'abc'

      repository
        .setup(async r => r.findOne({ where: { id: user.id } }))
        .returns(async () => user)
    })

    describe('for an entity that exists', () => {
      it('should return the entity', async () => {
        const result = await sut.getById(user.id)
        expect(result).toEqual(user)
      })
    })

    describe('for an entity that doesn\'t exist', () => {
      it('should throw an EntityNotFound error', async () => {
        await expect(sut.getById('zzz')).rejects.toBeInstanceOf(EntityNotFound)
      })
    })
  })

})
