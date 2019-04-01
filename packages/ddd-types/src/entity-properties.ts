import { Uuid } from './uuid'

/**
 * Represents an entity object, that's identifiable by its id value
 */
export interface EntityProperties<TId = Uuid> {
  id: TId
}
