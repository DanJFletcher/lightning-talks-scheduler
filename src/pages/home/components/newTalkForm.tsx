import Select from '../../../components/forms/Select'
import { useState } from 'react'
import Button from '../../../components/forms/Button'
import Form from '../../../components/forms/Form'
import TextInput from '../../../components/forms/TextInput'
import { ScheduledEvent } from '../Home'
import netlifyIdentity from 'netlify-identity-widget'
import { toast } from 'react-toastify'

type FormData = {
  date: string
  name: string
  title: string
  time: string
}

const nullFormData: FormData = {
  date: '',
  name: '',
  title: '',
  time: '',
}

type NewTalkFormProps = {
  loggedIn: boolean
  user: netlifyIdentity.User | null
  availableDates: ScheduledEvent[]
  login: () => void
}

const NewTalkForm: React.FC<NewTalkFormProps> = ({
  loggedIn,
  user,
  login,
  availableDates,
}) => {
  const [formData, setFormData] = useState<FormData>(nullFormData)

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault()

    let response: Response
    try {
      response = await fetch('.netlify/functions/create-talk', {
        method: 'POST',
        body: JSON.stringify({
          user,
          formData,
        }),
      })
    } catch (e) {
      toast.error(`Something exploded 💥 and now you're SOL ¯\\_(ツ)_/¯`)
      return
    }

    if (response.status === 204) {
      toast('⚡ Thanks for submitting your talk!')
      setFormData(nullFormData)
      window.scrollTo(0, 0)
    } else {
      toast.error(`Something exploded 💥 and now you're SOL ¯\\_(ツ)_/¯`)
    }
  }

  const handleFormUpdate = (key: string, value: string) =>
    setFormData({ ...formData, [key]: value })

  return (
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
  )
}

export default NewTalkForm
