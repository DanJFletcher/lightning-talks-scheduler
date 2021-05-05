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

export const getNextScheduledEvent = (dates: ScheduledEvent[]) => {
  const now = new Date()
  const MAX_DATE = 8640000000000000
  let nextEvent: ScheduledEvent = { date: new Date(MAX_DATE).toString(), id: 0 }

  dates.forEach((date) => {
    const currentDate = new Date(date.date)
    console.log(currentDate, currentDate >= now)

    if (
      (currentDate >= now || isToday(currentDate)) &&
      currentDate < new Date(nextEvent.date)
    ) {
      nextEvent = date
    }
  })

  return nextEvent
}
