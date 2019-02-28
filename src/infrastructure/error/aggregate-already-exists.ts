import { PersistenceError } from './persistence-error'
import { Uuid } from '../../shared'

export class AggregateAlreadyExists extends PersistenceError {
  /**
   * Attempted to persist an aggregate that already exists in the underlying data store
   */
  constructor (
    readonly aggregateName: string,
    readonly id: Uuid
  ) {
    super('Attempted to persist an aggregate that already exists in the underlying data store')
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
