import { Uuid } from '../shared'

/**
 * Represents an entity object, that's identifiable by its id value
 */
export interface EntityProperties<IdType = Uuid> {
  id: IdType
}

export abstract class Entity<IdType = Uuid> implements EntityProperties<IdType> {

  protected constructor (
    readonly id: IdType
  ) {
  }

}
