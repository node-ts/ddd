import { Event } from '@node-ts/bus-messages'
import { Uuid } from '@node-ts/ddd-types'

export class AlarmSystemRegistered extends Event {
  static readonly NAME = 'node-ts/ddd-example/alarm/alarm-system-registered'
  readonly $name = AlarmSystemRegistered.NAME
  readonly $version = 0

  constructor (
    readonly id: Uuid
  ) {
    super()
  }

}
