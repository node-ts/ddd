import { EntityProperties } from '../domain'
import { Uuid } from '../shared'
import { PrimaryColumn } from 'typeorm'

export class Model implements EntityProperties {
  @PrimaryColumn('uuid')
  id: Uuid
}
