import { AggregateRootProperties } from '@node-ts/ddd-types'
import { Model } from './model'
import { Column } from 'typeorm'

export class WriteModel extends Model implements AggregateRootProperties {
  @Column()
  version: number
}
