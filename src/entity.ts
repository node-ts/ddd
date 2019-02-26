/**
 * Represents an entity object, that's identifiable by its id value
 */
export interface EntityProperties<IdType = string> {
  id: IdType
}

export abstract class Entity<IdType = string> implements EntityProperties<IdType> {

  protected constructor (
    readonly id: IdType
  ) {
  }

}
