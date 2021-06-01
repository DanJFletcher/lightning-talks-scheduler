import { ScheduledEvent } from './Home'

export class Foo {
  bar() {
    return 'hey oh'
  }
}

const isToday = (date: Date) => {
  return false
  // const today = new Date()
  // return (
  //   date.getDate() === today.getDate() &&
  //   date.getMonth() === today.getMonth() &&
  //   date.getFullYear() === today.getFullYear()
  // )
}

const NO_FUTURE_EVENTS: ScheduledEvent = { date: 'No Future Events', id: 0 }

export const getNextScheduledEvent = (
  scheduledEvents: ScheduledEvent[],
  now = new Date(Date.now())
) => {
  const MAX_DATE = 8640000000000000
  const anEventWayOutInTheFuture: ScheduledEvent = {
    date: new Date(MAX_DATE).toString(),
    id: 0,
  }

  let nextEvent = anEventWayOutInTheFuture

  scheduledEvents.forEach((event) => {
    const currentDate = new Date(event.date)

    if (
      (currentDate >= now || isToday(currentDate)) &&
      currentDate < new Date(nextEvent.date)
    ) {
      nextEvent = event
    }
  })

  if (nextEvent === anEventWayOutInTheFuture) {
    return NO_FUTURE_EVENTS
  }

  return nextEvent
}
