import chai from 'chai'
import chaiEvents from 'chai-events'
import EventEmitter from 'events'

chai.use(chaiEvents)
const should = chai.should()

let emitter = null

describe('Events - push result', () => {
  beforeEach( () => {
    emitter = new EventEmitter()
  })

  it('should receive PUSH_EVENT event', () => {
    const PUSH_EVENT = 'PUSH_EVENT'
    const predicate = emitter.should.emit(PUSH_EVENT)

    setTimeout(() => {
      emitter.emit(PUSH_EVENT)
    }, 300)

    return predicate;
  })

  it('should not respond to non defined alert', () => {
    emitter.should.not.emit('NON_DEFINED_ALERT')
  })

  it('should not respond to non defined alert', () => {
    emitter.should.not.emit('NON_DEFINED_ALERT', {timeout: 500})
  })
})