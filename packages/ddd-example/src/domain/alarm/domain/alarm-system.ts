import { AggregateRoot, AggregateRootProperties, Uuid } from '@node-ts/ddd'
import { Siren, SirenProperties } from './siren'
import { RegisterAlarmSystem, AlarmSystemRegistered, AlarmSirenSilenced, SilenceAlarmSiren } from '../../../messages'
import { SirenNotFound, SilencedInactiveSiren } from './error'

export interface AlarmSystemProperties extends AggregateRootProperties {
  readonly sirens: Siren[]
}

export class AlarmSystem
  extends AggregateRoot
  implements AlarmSystemProperties {

  readonly sirens: SirenProperties[]

  constructor (id: Uuid) {
    super(id)
  }

  static register ({ id }: RegisterAlarmSystem): AlarmSystem {
    const alarmSystemRegistered = new AlarmSystemRegistered(id)

    const alarmSystem = new AlarmSystem(id)
    alarmSystem.when(alarmSystemRegistered)
    return alarmSystem
  }

  silenceAlarm (command: SilenceAlarmSiren): void {
    const siren = this.sirens.find(s => s.name === command.sirenName)
    if (!siren) {
      throw new SirenNotFound(command.sirenName, this.id)
    }

    if (!siren.isActivated) {
      throw new SilencedInactiveSiren(command.sirenName, this.id)
    }

    const alarmSirenSilenced = new AlarmSirenSilenced(this.id, command.sirenName, false)
    this.when(alarmSirenSilenced)
  }

  protected whenAlarmSystemRegistered (_: AlarmSystemRegistered): void {
    // ...
  }

  protected whenAlarmSirenSilenced (event: AlarmSirenSilenced): void {
    const siren = this.sirens.find(s => s.name === event.sirenName)!
    siren.isActivated = event.isActivated
  }

}
