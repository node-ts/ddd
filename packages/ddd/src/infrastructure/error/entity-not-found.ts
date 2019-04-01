import { PersistenceError } from './persistence-error'
import { Uuid } from '@node-ts/ddd-types'

export class EntityNotFound extends PersistenceError {
  constructor (
    readonly entityName: string,
    readonly id: Uuid
  ) {
    super('Could not find entity in data store')
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
