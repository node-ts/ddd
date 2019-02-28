import { PersistenceError } from './persistence-error'
import { Uuid } from '../../shared'

export class DeletingNewAggregate extends PersistenceError {
  constructor (
    readonly aggregateName: string,
    readonly id: Uuid
  ) {
    super('Attempted to delete an aggregate that has never been saved in the data store')
  }
}
