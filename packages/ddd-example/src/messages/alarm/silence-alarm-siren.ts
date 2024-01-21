import { Command } from '@node-ts/bus-messages'
import { Uuid } from '@node-ts/ddd-types'

export class SilenceAlarmSiren extends Command {
  static NAME = 'node-ts/ddd-example/alarm/silence-alarm-siren'
  readonly $name = SilenceAlarmSiren.NAME
  readonly $version = 0

  constructor(
    readonly alarmSystemId: Uuid,
    readonly sirenName: string,
    readonly isActivated: boolean
  ) {
    super()
  }
}
