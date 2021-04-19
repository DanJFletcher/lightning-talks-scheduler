import React, { useEffect, useState } from 'react'
import netlifyIdentity from 'netlify-identity-widget'
import { Link } from 'react-router-dom'
import Select from '../components/forms/Select'
import Button from '../components/forms/Button'
import Form from '../components/forms/Form'
import TextInput from '../components/forms/TextInput'
import NoDataImage from '../images/no-data-illistration.jpg'
import { Talk } from './Admin'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const talks: Talk[] = [
  // {
  //   speaker: 'Brian Hogg',
  //   title: `My journey into home automation with Home Assistant`,
  //   start: '3:30',
  //   end: '3:45',
  //   event: 0,
  //   scheduled: true,
  // },
]

const isToday = (date: Date) => {
  return false
  // const today = new Date()
  // return (
  //   date.getDate() === today.getDate() &&
  //   date.getMonth() === today.getMonth() &&
  //   date.getFullYear() === today.getFullYear()
  // )
}

const getNextScheduledEvent = (dates: ScheduledEvent[]) => {
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

interface HomeProps {
  loggedIn: boolean
  user: netlifyIdentity.User | null
  logout: () => void
  login: () => void
}

interface ScheduledEvent {
  date: string
  id: number
}

interface ScheduledEventResponse {
  data: { date: number }
  ref: {
    '@ref': { id: number }
  }
}

type FormData = {
  date: string
  name: string
  title: string
  time: string
}

const nullFormData = {
  date: '',
  name: '',
  title: '',
  time: '',
}

const Home: React.FC<HomeProps> = ({ loggedIn, user, logout, login }) => {
  const [formData, setFormData] = useState<FormData>(nullFormData)
  const [availableDates, setAvailableDates] = useState<ScheduledEvent[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [nextScheduledEvent, setNextScheduledEvent] = useState(
    'Fetching next event...'
  )

  useEffect(() => {
    setIsAdmin(!!user && !!user.app_metadata?.roles?.find((x) => x === 'admin'))
  }, [user])

  useEffect(() => {
    if (availableDates.length < 1) {
      return
    }

    setNextScheduledEvent(getNextScheduledEvent(availableDates).date)
  }, [availableDates])

  useEffect(() => {
    ;(async () => {
      const response = await fetch('.netlify/functions/scheduled-events')
      const data: ScheduledEventResponse[] = await response.json()
      setAvailableDates(
        data.map((x) => ({
          date: new Date(x.data.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC',
          }),
          id: x.ref['@ref'].id,
        }))
      )
    })()
  }, [])

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault()
    const response = await fetch('.netlify/functions/create-talk', {
      method: 'POST',
      body: JSON.stringify({
        user,
        formData,
      }),
    })

    if (response.status === 204) {
      toast('⚡ Thanks for submitting your talk!')
      setFormData(nullFormData)
      window.scrollTo(0, 0)
    }
  }

  const handleFormUpdate = (key: string, value: string) =>
    setFormData({ ...formData, [key]: value })

  return (
    <div className="App bg-gray-100 pt-6">
      {loggedIn ? (
        <>
          <p>You're logged in as {user?.user_metadata?.full_name}</p>
          <p
            className="underline cursor-pointer text-blue-500"
            onClick={logout}
          >
            Sign out
          </p>
          {isAdmin ? (
            <Link
              to="/admin"
              className="underline cursor-pointer text-blue-500 m-6 block"
            >
              Admin
            </Link>
          ) : null}
        </>
      ) : null}
      <h1 className="text-6xl font-extrabold">Vehikl Lightning Talks</h1>
      <div className="text-6xl mt-4">⚡</div>
      <section className="mt-4">
        <h2 className="text-4xl mt-14">Next Event</h2>
        <p className="text-5xl mt-4">{nextScheduledEvent}</p>

        <h3 className="text-2xl mt-6">Scheduled Talks</h3>

        <div className="flex justify-center mt-6 flex-wrap">
          {talks.length > 0 ? (
            talks.map((talk) => (
              <div className="bg-white m-2 p-4 shadow-md w-44">
                <div className="mt-4 mb-4 font-bold">
                  {talk.start} - {talk.end}
                </div>
                <h4 className="text-2xl mb-4">{talk.speaker}</h4>
                <div className="">{talk.title}</div>
              </div>
            ))
          ) : (
            <div className="w-full bg-white justify-center flex flex-wrap p-6 box-content overflow-hidden">
              <h4 className="text-2xl w-full">
                No Talks Have Been Scheduled For This Event!
              </h4>
              <a className="w-full mt-4 underline" href="#submit-talk">
                Why not submit one?
              </a>
              <img
                src={NoDataImage}
                alt="No data found"
                className="h-96 mb-6"
              />
            </div>
          )}
        </div>
      </section>

      <section className="mt-28 mb-28" id="submit-talk">
        <Form title="Submit a Talk" handleSubmit={handleSubmit}>
          {loggedIn ? (
            <>
              <Select
                labelName="Date"
                labelId="date"
                options={availableDates.map((x) => ({ ...x, text: x.date }))}
                selected={formData.date}
                handleChange={(e) => handleFormUpdate('date', e.target.value)}
              />
              <TextInput
                labelName="Name"
                labelId="name"
                placeholderText="What is your name?"
                handleChange={(e) => handleFormUpdate('name', e.target.value)}
                value={formData.name}
              />
              <TextInput
                labelName="Title"
                labelId="title"
                placeholderText="What is your talk about?"
                handleChange={(e) => handleFormUpdate('title', e.target.value)}
                value={formData.title}
              />
              <TextInput
                labelName="Length"
                labelId="length"
                placeholderText="How long is your talk?"
                handleChange={(e) => handleFormUpdate('time', e.target.value)}
                value={formData.time}
              />

              <Button type="submit" buttonText="Submit" />
            </>
          ) : (
            <Button type="button" buttonText="Login" handleClick={login} />
          )}
        </Form>
      </section>

      <footer className="bg-white w-full py-8 px-4">
        <p>
          Created with ❤ at{' '}
          <a href="//vehikl.com" className="underline">
            Vehikl
          </a>
        </p>
        <p>
          Data vector created by stories -{' '}
          <a href="https://www.freepik.com/vectors/data" className="underline">
            www.freepik.com
          </a>
        </p>
      </footer>
      <ToastContainer />
    </div>
  )
}

export default Home
