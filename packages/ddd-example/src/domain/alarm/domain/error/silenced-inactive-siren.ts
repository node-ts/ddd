import { Uuid } from '@node-ts/ddd-types'

export class SilencedInactiveSiren extends Error {
  constructor (
    readonly sirenName: string,
    readonly alarmSystemId: Uuid
  ) {
    super(`Cannot silence a siren that is not activated`)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
