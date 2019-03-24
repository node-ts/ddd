import { IdType } from '../shared'

/**
 * Represents an entity object, that's identifiable by its id value
 */
export interface EntityProperties<TId extends IdType> {
  id: TId
}

export abstract class Entity<TId extends IdType> implements EntityProperties<TId> {

  protected constructor (
    readonly id: TId
  ) {
  }

}
