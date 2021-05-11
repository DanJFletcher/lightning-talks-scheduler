import rewire from 'rewire'
const getNextScheduledEvent = rewire('./getNextScheduledEvent')
// @ponicode
describe('getNextScheduledEvent.getNextScheduledEvent', () => {
  test('0', () => {
    let resetNow: any = getNextScheduledEvent.__set__(
      'now',
      new Date('1970-05-06T20:27:35.090Z')
    )
    let param1: any = [
      { date: '01-01-2020', id: 200 },
      { date: '32-01-2020', id: 500 },
      { date: '01-01-2020', id: 404 },
    ]
    let result: any = getNextScheduledEvent.getNextScheduledEvent(param1)
    expect(result).toEqual({ date: 'No Future Events', id: 0 })
    resetNow()
  })

  test('1', () => {
    let result: any = getNextScheduledEvent.getNextScheduledEvent([])
    expect(result).toEqual({ date: 'No Future Events', id: 0 })
  })

  test('2', () => {
    let param1: any = [{ date: '32-01-2020', id: 429 }]
    let result: any = getNextScheduledEvent.getNextScheduledEvent(param1)
    expect(result).toEqual({ date: 'No Future Events', id: 0 })
  })
})
