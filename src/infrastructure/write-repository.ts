import { AggregateRoot } from '../domain'
import { Uuid } from '../shared'

/**
 * A write repository deals with retrieval and persistence of aggregate roots only.
 * Retrieval of aggregate roots are generally done just by Id, and generally return
 * the entire aggregate.
 *
 * Entities outside of the aggregate boundary are not returned. If you need this
 * functionality, you probably need to use a @see ReadRepository
 */
export interface WriteRepository <AggregateRootType extends AggregateRoot> {

  /**
   * Retrieve an aggregate from the underlying persistence using its Id
   * @throws AggregateNotFound if no aggregate root with @param id could be found
   */
  getById (id: Uuid): Promise<AggregateRootType>

  /**
   * Persist the entire aggregate, including any child entities. This operation
   * should be transactional so that all aggregate entities are saved or none.
   */
  save (aggregateRoot: AggregateRootType): Promise<void>
}
