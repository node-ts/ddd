import { Column } from 'typeorm'
import { Model } from './model'

/**
 * Models an aggregate root entity in the database, which adds the `version` column used
 * to manage the database isolation level and hence contention.
 */
export abstract class AggregateRootModel extends Model {
  @Column()
  version: number
}
