import { injectable, unmanaged } from 'inversify'
import { ClassConstructor } from '@node-ts/logger-core'
import { Uuid, EntityProperties } from '@node-ts/ddd-types'
import { Repository, DataSource } from 'typeorm'
import { EntityNotFound } from './error'

/**
 * Read repositories return any object, real or projected, from the
 * underlying persistence. The simplest return entities from a single
 * table.
 *
 * If the data store you're reading from is the same as what you use for
 * writing, or if it shares the same schema, then it's important to
 * understand that read repositories are not constrained by aggregate boundaries.
 * Any table can be joined with any other table, aggregates can be performed, and
 * views constructed.
 *
 * When joining across multiple aggregate tables, be mindful that due to eventual
 * consistency not all the data may be present during the query execution. As such
 * design joins with this in mind (ie: inner joins when all data must be present, outer
 * joins when data is optional).
 */
@injectable()
export class ReadRepository<EntityType extends EntityProperties> {

  protected readonly repository: Repository<EntityType>

  constructor (
    databaseConnection: DataSource,
    @unmanaged() private readonly readModelType: ClassConstructor<EntityType>
  ) {

    this.repository = databaseConnection.getRepository(this.readModelType)
  }

  /**
   * Returns the read model based on its id
   * @throws {EntityNotFound}
   */
  async getById (id: EntityType['id']): Promise<EntityType> {
    // tslint:disable-next-line:no-any Can't wrangle correct type
    const readModel = await this.repository.findOneBy({ id: id as any })
    if (!readModel) {
      throw new EntityNotFound(this.readModelType.name, id)
    } else {
      return readModel
    }
  }
}
