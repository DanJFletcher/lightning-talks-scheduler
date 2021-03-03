import React, { useEffect, useState } from 'react';
import netlifyAuth from './netlifyAuth';
import './App.css';
import netlifyIdentity from 'netlify-identity-widget'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Admin, { Talk } from './pages/Admin';
import NoDataImage from './images/no-data-illistration.jpg'
import Form from './components/forms/Form';
import Select from './components/forms/Select';
import TextInput from './components/forms/TextInput';

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
  //   end: '4:55'
  // }
]

function App() {
  const [user, setUser] = useState<netlifyIdentity.User | null>(null)
  const [loggedIn, setLoggedIn] = useState(netlifyAuth.isAuthenticated)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    netlifyAuth.initialize((user: netlifyIdentity.User) => {
      setLoggedIn(!!user)
      setUser(user)
      console.log(user)
    })
  }, [])

  const login = () => {
    netlifyAuth.authenticate((user: netlifyIdentity.User) => {
      setLoggedIn(!!user)
      setUser(user)
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const logout = () => {
    netlifyAuth.signout(() => {
      setLoggedIn(false)
      setUser(null)
    })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    console.log('hey')
    event.preventDefault()
    fetch('.netlify/functions/create-talk', {
      method: 'POST',
      body: JSON.stringify({
        user,
        formData
      })
    })
  }

  const handleFormUpdate = (key: string, value: string) => setFormData({...formData, [key]: value})

  return (
    <Router>

      <Switch>
        {user && user.app_metadata.roles.find(x => x === 'admin') ? (<Route path="/admin">
          <Admin />
        </Route>) : null }
        <Route path="/">
          <div className="App bg-gray-100 pt-6">
            {loggedIn ? (
              <>
                <p>You're logged in as {user?.user_metadata?.full_name}</p>
                <p
                  className="underline cursor-pointer text-blue-500"
                  onClick={logout}
                >Sign out</p>
                {user && user.app_metadata.roles.find(x => x === 'admin') ? (
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
              <p className="text-5xl mt-4">Friday March 26th, 2021</p>

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

            <section className="mt-16" id="submit-talk">
              <Form title="Submit a Talk" handleSubmit={handleSubmit}>

                  {loggedIn ? (
                    <>
                      <Select labelName="Date" labelId="date" options={['Feb 26th 2021', 'March 26th 2021']} handleChange={(e) => handleFormUpdate('data', e.target.value)}/>
                      <TextInput labelName="Name" labelId="name" placeholderText="What is your name?" handleChange={(e) => handleFormUpdate('speaker', e.target.value)} />
                      <TextInput labelName="Title" labelId="title" placeholderText="What is your talk about?" handleChange={(e) => handleFormUpdate('title', e.target.value)} />
                      <TextInput labelName="Length" labelId="length" placeholderText="How long is your talk?" handleChange={(e) => handleFormUpdate('length', e.target.value)} />

                      <button
                        className="block text-center text-white bg-gray-800 p-3 duration-300 rounded-sm hover:bg-black w-full"
                        type="submit"
                      >Submit</button>
                      </>
                  ) : (
                    <button
                      className="block text-center text-white bg-gray-800 p-3 duration-300 rounded-sm hover:bg-black w-full mt-8"
                      onClick={login}
                    >Login</button>
                  )}
              </Form>
            </section>

            <footer className="bg-white w-full py-8 px-4">
              <p>Created with ❤ at <a href="//vehikl.com" className="underline">Vehikl</a></p>
              <p>Data vector created by stories - <a href='https://www.freepik.com/vectors/data' className="underline">www.freepik.com</a></p>
            </footer>

          </div>
        </Route>

      </Switch>
    </Router>
  );
}

export default App;
