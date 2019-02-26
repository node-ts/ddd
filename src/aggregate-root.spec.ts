// tslint:disable:max-classes-per-file

import { AggregateRoot } from './aggregate-root'
import { Event } from '@node-ts/bus-messages'

class SomethingHappens extends Event {
  $name = 'node-ts/ddd/something-happens'
  $version = 0

  example = 2
}

class TestAggregateRoot extends AggregateRoot {
  example = 1

  protected whenSomethingHappens (event: SomethingHappens): void {
    this.example = event.example
  }
}

describe('AggregateRoot', () => {
  let sut: TestAggregateRoot

  beforeEach(() => {
    sut = new TestAggregateRoot('abc')
  })

  describe('when an event is added', () => {
    const somethingHappens = new SomethingHappens()
    beforeEach(() => {
      sut.when(somethingHappens)
    })

    it('should add it to the list of changes', () => {
      expect(sut.changes).toHaveLength(1)
    })

    it('should call whenSomethingHappens with the event', () => {
      expect(sut.example).toEqual(somethingHappens.example)
    })
  })

})
