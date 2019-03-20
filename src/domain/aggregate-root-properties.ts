import { EntityProperties } from './entity'
import { Uuid } from '../shared'

export interface AggregateRootProperties<IdType = Uuid> extends EntityProperties<IdType> {
  /**
   * Represents which verison of the aggregate the instance is using. Versions
   * of an aggregate are incremented each time a new event is applied.
   */
  version: number
}
