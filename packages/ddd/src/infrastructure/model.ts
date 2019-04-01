import { Uuid, EntityProperties } from '@node-ts/ddd-types'
import { PrimaryColumn } from 'typeorm'

export abstract class Model implements EntityProperties {
  @PrimaryColumn('uuid')
  id: Uuid
}
