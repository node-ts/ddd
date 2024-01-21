import { Uuid, EntityProperties } from '@node-ts/ddd-types'

export abstract class Entity<TId = Uuid> implements EntityProperties<TId> {
  protected constructor(readonly id: TId) {}
}
