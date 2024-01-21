// tslint:disable:max-classes-per-file

import { AggregateRoot } from './aggregate-root'
import { Event } from '@node-ts/bus-messages'

class SomethingHappens extends Event {
  $name = 'node-ts/ddd/something-happens'
  $version = 0

  example = 2
}

class AggregateDeleted extends Event {
  $name = 'node-ts/ddd/aggregate-deleted'
  $version = 0
}

class TestAggregateRoot extends AggregateRoot {
  example = 1

  purge(): void {
    const aggregateDeleted = new AggregateDeleted()
    this.delete(aggregateDeleted)
  }

  protected whenSomethingHappens(event: SomethingHappens): void {
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
      // tslint:disable-next-line:no-string-literal Naughty way to test protected methods
      sut['when'](somethingHappens)
    })

    it('should add it to the list of changes', () => {
      expect(sut.changes).toHaveLength(1)
    })

    it('should call whenSomethingHappens with the event', () => {
      expect(sut.example).toEqual(somethingHappens.example)
    })
  })

  describe('when the aggregate is deleted', () => {
    beforeEach(() => {
      sut.purge()
    })

    it('should add the deletion event to the list of changes', () => {
      expect(sut.changes).toHaveLength(1)
    })

    it('should flag the aggregate as deleted', () => {
      expect(sut.isDeleted).toEqual(true)
    })
  })

  describe('when changes are cleared', () => {
    const somethingHappens = new SomethingHappens()
    beforeEach(() => {
      // tslint:disable-next-line:no-string-literal Naughty way to test protected methods
      sut['when'](somethingHappens)
    })

    it('should have no changes', () => {
      expect(sut.changes).toHaveLength(1)
      sut.clearChanges()
      expect(sut.changes).toHaveLength(0)
    })
  })
})
