import { Event } from '@node-ts/bus-messages'
import { Uuid } from '@node-ts/ddd-types'

export class AlarmSirenSilenced extends Event {
  static readonly NAME = 'node-ts/ddd-example/alarm/alarm-siren-silenced'
  readonly $name = AlarmSirenSilenced.NAME
  readonly $version = 0

  constructor (
    readonly alarmSystemId: Uuid,
    readonly sirenName: string,
    readonly isActivated: boolean
  ) {
    super()
  }

}
