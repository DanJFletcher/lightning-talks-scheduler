import * as getNextScheduledEvent from './getNextScheduledEvent'
// @ponicode
describe('getNextScheduledEvent.getNextScheduledEvent', () => {
  test('0', () => {
    let param1: any = [
      { date: '01-01-2030', id: 400 },
      { date: '32-01-2020', id: 429 },
      { date: '01-01-2020', id: 500 },
    ]
    let param2: any = new Date('01-01-2020')
    getNextScheduledEvent.getNextScheduledEvent(param1, param2)
  })

  test('1', () => {
    let param1: any = [{ date: '32-01-2020', id: 200 }]
    let param2: any = new Date('01-01-2020')
    getNextScheduledEvent.getNextScheduledEvent(param1, param2)
  })

  test('2', () => {
    let param2: any = new Date('01-01-2020')
    getNextScheduledEvent.getNextScheduledEvent([], param2)
  })

  test('3', () => {
    let param1: any = [
      { date: '01-01-2019', id: 200 },
      { date: '01-04-2020', id: 201 },
    ]
    let param2: any = new Date('01-01-2020')
    getNextScheduledEvent.getNextScheduledEvent(param1, param2)
  })

  test('4', () => {
    let param1: any = [
      { date: '01-04-2020', id: 201 },
      { date: '01-01-2019', id: 200 },
    ]
    let param2: any = new Date('01-01-2020')
    getNextScheduledEvent.getNextScheduledEvent(param1, param2)
  })
})
