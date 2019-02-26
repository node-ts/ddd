import { Entity } from './entity'

export interface AggregateRootProperties extends Entity {
  /**
   * Represents which verison of the aggregate the instance is using. Versions
   * of an aggregate are incremented each time a new event is applied.
   */
  version: number
}
