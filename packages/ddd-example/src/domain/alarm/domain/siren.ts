export interface SirenProperties {
  name: string
  volume: number
  isActivated: boolean
}

export class Siren implements SirenProperties {
  name: string
  volume: number
  isActivated: boolean
}
