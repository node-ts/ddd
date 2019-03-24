import { EntityProperties } from './entity'
import { IdType } from '../shared'

export interface AggregateRootProperties<TId extends IdType> extends EntityProperties<TId> {
  /**
   * Represents which verison of the aggregate the instance is using. Versions
   * of an aggregate are incremented each time a new event is applied.
   */
  version: number
}
