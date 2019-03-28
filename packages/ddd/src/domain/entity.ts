import { Uuid } from '../shared'

/**
 * Represents an entity object, that's identifiable by its id value
 */
export interface EntityProperties<TId = Uuid> {
  id: TId
}

export abstract class Entity<TId = Uuid> implements EntityProperties<TId> {

  protected constructor (
    readonly id: TId
  ) {
  }

}
