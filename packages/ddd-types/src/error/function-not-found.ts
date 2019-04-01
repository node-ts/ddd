import { Event } from '@node-ts/bus-messages'

export class FunctionNotFound extends Error {
  constructor (
    readonly event: Event,
    readonly expectedFunctionName: string
  ) {
    super('Could not find a handler for event')
    Object.setPrototypeOf(this, FunctionNotFound.prototype)
  }
}
