import { Command } from '@node-ts/bus-messages'
import { Uuid } from '@node-ts/ddd'

export class RegisterAlarmSystem extends Command {
  static NAME = 'node-ts/ddd-example/alarm/register-alarm-system'
  readonly $name = RegisterAlarmSystem.NAME
  readonly $version = 0

  constructor (
    readonly id: Uuid
  ) {
    super()
  }

}
