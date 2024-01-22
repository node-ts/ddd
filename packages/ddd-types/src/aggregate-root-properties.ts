import { EntityProperties } from './entity-properties'
import { Uuid } from './uuid'

export interface AggregateRootProperties<IdType = Uuid>
  extends EntityProperties<IdType> {
  /**
   * Represents which version of the aggregate the instance is using. Versions
   * of an aggregate are incremented each time a new event is applied.
   */
  version: number
}
