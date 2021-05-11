import { ScheduledEvent } from './Home'

const isToday = (date: Date) => {
  return false
  // const today = new Date()
  // return (
  //   date.getDate() === today.getDate() &&
  //   date.getMonth() === today.getMonth() &&
  //   date.getFullYear() === today.getFullYear()
  // )
}
let now = new Date(Date.now())

export const getNextScheduledEvent = (scheduledEvents: ScheduledEvent[]) => {
  const noFutureEvents = { date: 'No Future Events', id: 0 }

  if (scheduledEvents.length === 0) {
    return noFutureEvents
  }

  const MAX_DATE = 8640000000000000
  const anEventWayOutInTheFuture: ScheduledEvent = {
    date: new Date(MAX_DATE).toString(),
    id: 0,
  }

  let nextEvent = anEventWayOutInTheFuture

  scheduledEvents.every((event) => {
    const currentDate = new Date(event.date)
    const nextEventDate = new Date(nextEvent.date)

    if (isNaN(currentDate.getTime())) {
      nextEvent = noFutureEvents
      return false
    }

    if (
      (currentDate >= now || isToday(currentDate)) &&
      currentDate < nextEventDate
    ) {
      nextEvent = event
      return false
    } else if (currentDate < now) {
      nextEvent = noFutureEvents
    }
  })

  return nextEvent
}
