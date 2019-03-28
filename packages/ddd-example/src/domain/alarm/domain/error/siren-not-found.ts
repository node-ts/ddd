import { Uuid } from '@node-ts/ddd'

export class SirenNotFound extends Error {
  constructor (
    readonly name: string,
    readonly alarmSystemId: Uuid
  ) {
    super(`Siren was not found for alarm system`)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
