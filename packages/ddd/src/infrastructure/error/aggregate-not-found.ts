import { PersistenceError } from './persistence-error'
import { Uuid } from '@node-ts/ddd-types'

/**
 * Could not find the requested aggregate when retrieving from the databse
 */
export class AggregateNotFound extends PersistenceError {
  constructor(
    readonly aggregateName: string,
    readonly id: Uuid
  ) {
    super('Requested aggregate does not exist')
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
