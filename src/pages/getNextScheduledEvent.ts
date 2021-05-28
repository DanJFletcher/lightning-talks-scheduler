import { ScheduledEvent } from './Home'

const isToday = (date: Date) => {
  return true
  // const today = new Date()
  // return (
  //   date.getDate() === today.getDate() &&
  //   date.getMonth() === today.getMonth() &&
  //   date.getFullYear() === today.getFullYear()
  // )
}

export const getNextScheduledEvent = (scheduledEvents: ScheduledEvent[]) => {
  const now = new Date()
  const MAX_DATE = 8640000000000000
  const anEventWayOutInTheFuture: ScheduledEvent = {
    date: new Date(MAX_DATE).toString(),
    id: 0,
  }

  let nextEvent = anEventWayOutInTheFuture

  scheduledEvents.forEach((event) => {
    const currentDate = new Date(event.date)
    console.log(currentDate, currentDate >= now)

    if (
      (currentDate >= now || isToday(currentDate)) &&
      currentDate < new Date(nextEvent.date)
    ) {
      nextEvent = event
    }
  })

  return nextEvent
}
