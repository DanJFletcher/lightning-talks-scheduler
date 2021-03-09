import React, { useEffect, useState } from 'react'
import netlifyIdentity from 'netlify-identity-widget'
import { Link } from 'react-router-dom'
import Select from '../components/forms/Select';
import Button from '../components/forms/Button'
import Form from '../components/forms/Form'
import TextInput from '../components/forms/TextInput'
import NoDataImage from '../images/no-data-illistration.jpg'
import { Talk } from './Admin'

const talks: Talk[] = [
    // {
    //   speaker: 'Andrew Noble',
    //   title: `You won't believe this one simple trick to increase your unix productivity (sysadmins HATE it)`,
    //   start: '3:30',
    //   end: '3:45'
    // },
    // {
    //   speaker: 'Justin Struk',
    //   title: 'MobTime plugin for PHPStorm',
    //   start: '3:45',
    //   end: '3:55'
    // },
    // {
    //   speaker: 'Andrii Denysenko',
    //   title: `Firebase Analytics`,
    //   start: '3:55',
    //   end: '4:10'
    // },
    // {
    //   speaker: 'Felipe Flor',
    //   title: `Processing Images in Node`,
    //   start: '4:10',
    //   end: '4:20'
    // },
    // {
    //   speaker: 'Deep Panchel',
    //   title: `Free* Backend by Hasura`,
    //   start: '4:20',
    //   end: '4:40'
    // },
    // {
    //   speaker: 'Attila Komaromi',
    //   title: `Using TensorFlow.js in React to Categorize Images`,
    //   start: '4:35',
    //   end: '4:40'
    // },
    // {
    //   speaker: 'Dan Fletcher',
    //   title: `Netlify Functions`,
    //   start: '4:40',
    //   end: '4:55',
    //   scheduled: true,
    //   event: 1
    // }
]

const getNextScheduledEvent = (dates: ScheduledEvent[]) => {
    const now = new Date();
    const MAX_DATE = 8640000000000000;
    let nextEvent: ScheduledEvent = {date: new Date(MAX_DATE).toString(), id: 0};

    dates.forEach((date) => {
        const currentDate = new Date(date.date)

        if (currentDate >= now && (currentDate < new Date(nextEvent.date) || currentDate < new Date(nextEvent.date))) {
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
    date: string,
    id: number
}

interface ScheduledEventResponse {
    data:{date: number} 
    ref: {
        '@ref': {id: number}
    }
}

const Home: React.FC<HomeProps> = ({ loggedIn, user, logout, login }) => {
    const [formData, setFormData] = useState({})
    const [availableDates, setAvailableDates] = useState<ScheduledEvent[]>([])
    const [isAdmin, setIsAdmin] = useState(false)
    const [nextScheduledEvent, setNextScheduledEvent] = useState('Fetching next event...')

    useEffect(() => {
        setIsAdmin(!!user && !!user.app_metadata.roles.find(x => x === 'admin'))
    }, [user])

    useEffect(() => {
        if (availableDates.length < 1) {
            return;
        }

        setNextScheduledEvent(getNextScheduledEvent(availableDates).date)
    }, [availableDates])

    useEffect(() => {
        (async () => {
            const response = await fetch('.netlify/functions/scheduled-events')
            const data: ScheduledEventResponse[] = await response.json()
            setAvailableDates(data.map((x) => ({
                date: (new Date(x.data.date)).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    timeZone: 'UTC'
                }), 
                id: x.ref['@ref'].id
            })))
        })()
    }, [])

    const handleSubmit: React.FormEventHandler = (e) => {
        e.preventDefault()
        fetch('.netlify/functions/create-talk', {
            method: 'POST',
            body: JSON.stringify({
                user,
                formData
            })
        })
    }

    const handleFormUpdate = (key: string, value: string) => setFormData({ ...formData, [key]: value })

    return (
        <div className="App bg-gray-100 pt-6">
            {loggedIn ? (
                <>
                    <p>You're logged in as {user?.user_metadata?.full_name}</p>
                    <p
                        className="underline cursor-pointer text-blue-500"
                        onClick={logout}
                    >Sign out</p>
                    {isAdmin ? (
                        <Link to="/admin"
                            className="underline cursor-pointer text-blue-500 m-6 block"
                        >Admin</Link>
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
                    {talks.length > 0 ? talks.map(talk => (
                        <div className="bg-white m-2 p-4 shadow-md w-44">
                            <div className="mt-4 mb-4 font-bold">{talk.start} - {talk.end}</div>
                            <h4 className="text-2xl mb-4">{talk.speaker}</h4>
                            <div className="">{talk.title}</div>
                        </div>
                    )) :
                        <div className="w-full bg-white justify-center flex flex-wrap p-6 box-content overflow-hidden">
                            <h4 className="text-2xl w-full">No Talks Have Been Scheduled For This Event!</h4>
                            <a className="w-full mt-4 underline" href="#submit-talk">Why not submit one?</a>
                            <img src={NoDataImage} alt="No data found" className="h-96 mb-6" />
                        </div>
                    }

                </div>
            </section>

            <section className="mt-28 mb-28" id="submit-talk">
                <Form title="Submit a Talk" handleSubmit={handleSubmit}>
                    {loggedIn ? (
                        <>
                            <Select labelName="Date" labelId="date" options={availableDates.map(x => ({...x, text: x.date}))} handleChange={(e) => handleFormUpdate('data', e.target.value)} />
                            <TextInput labelName="Name" labelId="name" placeholderText="What is your name?" handleChange={(e) => handleFormUpdate('speaker', e.target.value)} />
                            <TextInput labelName="Title" labelId="title" placeholderText="What is your talk about?" handleChange={(e) => handleFormUpdate('title', e.target.value)} />
                            <TextInput labelName="Length" labelId="length" placeholderText="How long is your talk?" handleChange={(e) => handleFormUpdate('length', e.target.value)} />

                            <Button type="submit" buttonText="Submit" />
                        </>
                    ) : (
                        <Button type="button" buttonText="Login" handleClick={login} />
                    )}
                </Form>
            </section>


            <footer className="bg-white w-full py-8 px-4">
              <p>Created with ❤ at <a href="//vehikl.com" className="underline">Vehikl</a></p>
              <p>Data vector created by stories - <a href='https://www.freepik.com/vectors/data' className="underline">www.freepik.com</a></p>
            </footer>
        </div>
    )
}

export default Home

