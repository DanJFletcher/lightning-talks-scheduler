import React, { useEffect, useState } from 'react'
import netlifyIdentity from 'netlify-identity-widget'
import { Link } from 'react-router-dom'
import NoDataImage from '../../images/no-data-illistration.jpg'
import { Talk } from '../Admin'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getNextScheduledEvent } from './getNextScheduledEvent'

const talks: Talk[] = []

interface HomeProps {
  loggedIn: boolean
  user: netlifyIdentity.User | null
  logout: () => void
  login: () => void
}

export interface ScheduledEvent {
  date: string
  id: number
}

interface ScheduledEventResponse {
  data: { date: number }
  ref: {
    '@ref': { id: number }
  }
}

const Home: React.FC<HomeProps> = ({ loggedIn, user, logout, login }) => {
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
      if (!data.length) {
        setAvailableDates([])
      }
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
      <h1 className="text-6xl font-extrabold">Humi Lightning Talks</h1>
      <div className="text-6xl mt-4">⚡</div>
      <section className="mt-4">
        <h2 className="text-4xl mt-14">Next Event</h2>
        <p className="text-5xl mt-4">{nextScheduledEvent}</p>

        <h3 className="text-2xl mt-6">Scheduled Talks</h3>

        <div className="flex justify-center mt-6 flex-wrap ">
          {talks.length > 0 ? (
            talks.map((talk) => (
              <div className="bg-white m-2 p-4 shadow-md w-44">
                {talk.start ? (
                  <div className="mt-4 mb-4 font-bold">
                    {talk.start} - {talk.end}
                  </div>
                ) : null}
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

      <section className="mt-28 mb-28" id="submit-talk"></section>

      <footer className="bg-white w-full py-8 px-4">
        <p>
          Created with ❤ at{' '}
          <a href="//humi.ca" className="underline">
            Humi
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
