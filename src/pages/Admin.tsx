import React, { useEffect, useState } from 'react'
import Button from '../components/forms/Button'
import Form from '../components/forms/Form'

export interface Talk {
    speaker: string
    title: string
    start: string
    end: string
    scheduled: boolean
    event: number 
}

const Admin: React.FC = (props) => {
    const [talks, setTalks] = useState<Talk[]>([])
    const [eventDate, setEventDate] = useState<string|null>(null)

    const addEvent: React.FormEventHandler = (e) => {
        e.preventDefault()
        fetch('.netlify/functions/scheduled-events', {
            method: 'POST',
            body: JSON.stringify({
                date: eventDate
            })
        })
    }

    useEffect(() => {
        (async () => {
            const response = await fetch('.netlify/functions/get-talks')
            const data = await response.json()
            setTalks(data.data.map((x: { data: Talk[] }) => x.data))
        })()
    }, [])
    return (
        <>
            <h1 className="text-4xl">Admin</h1>
            <Form handleSubmit={(e) => null} title="Add Event">
                <div className="my-5 text-sm">
                    <label htmlFor="date" className="block text-black">Date</label>
                    <input 
                        type="date" 
                        id="date" 
                        name="date"
                        className="rounded-sm px-4 py-3 mt-3 focus:outline-none bg-gray-100 w-full"
                        onChange={(e) => setEventDate(e.target.value)}
                    />
                </div>
                <Button type="submit" handleClick={addEvent} buttonText="Add Event"/>
            </Form>
            <div className="flex justify-center mt-6 flex-wrap">
                {talks.map(talk => (
                  <div className="bg-white m-2 p-4 shadow-md w-44">
                    <div className="bg-gray-300 inline-block px-2 rounded-full text-sm">{talk.scheduled ? 'Scheduled' : 'Unscheduled'}</div>
                    <div className="mt-4 mb-4 font-bold">{talk.start} - {talk.end}</div>
                    <h4 className="text-2xl mb-4">{talk.speaker}</h4>
                    <div className="">{talk.title}</div>
                  </div>
                ))}
            </div>
        </>
    )
}

export default Admin