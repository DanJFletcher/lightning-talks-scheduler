import { useEffect, useState } from 'react';
import netlifyAuth from './netlifyAuth';
import './App.css';
import netlifyIdentity from 'netlify-identity-widget'

const talks = [
  {
    speaker: 'Andrew Noble',
    title: `You won't believe this one simple trick to increase your unix productivity (sysadmins HATE it)`,
    start: '3:30',
    end: '3:45'
  },
  {
    speaker: 'Justin Struk',
    title: 'MobTime plugin for PHPStorm',
    start: '3:45',
    end: '3:55'
  },
  {
    speaker: 'Andrii Denysenko',
    title: `Firebase Analytics`,
    start: '3:55',
    end: '4:10'
  },
  {
    speaker: 'Felipe Flor',
    title: `Processing Images in Node`,
    start: '4:10',
    end: '4:20'
  },
  {
    speaker: 'Deep Panchel',
    title: `Free* Backend by Hasura`,
    start: '4:20',
    end: '4:40'
  },
  {
    speaker: 'Attila Komaromi',
    title: `Using TensorFlow.js in React to Categorize Images`,
    start: '4:35',
    end: '4:40'
  },
  {
    speaker: 'Dan Fletcher',
    title: `Netlify Functions`,
    start: '4:40',
    end: '4:55'
  }
]

function App() {
  const [user, setUser] = useState<netlifyIdentity.User | null>(null)
  const [loggedIn, setLoggedIn] = useState(netlifyAuth.isAuthenticated)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    netlifyAuth.initialize((user: netlifyIdentity.User) => {
      setLoggedIn(!!user)
      setUser(user)
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

  return (
    <div className="App bg-gray-100 pt-6 pb-16">
      { loggedIn ? (
        <>
        <p>You're logged in as {user?.user_metadata?.full_name}</p>
        <p 
          className="underline cursor-pointer text-blue-500"
          onClick={logout}
        >Sign out</p>
        </>
      ) : null} 
        <h1 className="text-6xl font-extrabold">Vehikl Lightning Talks</h1>
        <div className="text-6xl mt-4">⚡</div>
      <section className="mt-4">
        <h2 className="text-4xl mt-14">Next Event</h2>
        <p className="text-5xl mt-4">Friday Feb 26th, 2021</p>

        <h3 className="text-2xl mt-6">Scheduled Talks</h3>

        <div className="flex justify-center mt-6 flex-wrap">
          {talks.map(talk => (
          <div className="bg-white m-2 p-4 shadow-md w-44">
            <div className="mt-4 mb-4 font-bold">{ talk.start } - { talk.end }</div>
            <h4 className="text-2xl mb-4">{ talk.speaker }</h4>
            <div className="">{ talk.title }</div>
          </div>
          ))}

        </div>
      </section>

      <section className="mt-16">
      <div className="bg-white lg:w-4/12 md:6/12 w-10/12 m-auto my-10 shadow-md">
            <div className="py-8 px-8 rounded-xl">
                <h1 className="font-medium text-2xl mt-3 text-center">Submit a Talk</h1>
                {loggedIn ? (

                <form onSubmit={handleSubmit} className="mt-6 text-left">

                    {/* Date */}
                    <div className="my-5 text-sm">
                        <label htmlFor="date" className="block text-black">Date</label>
                        <select 
                          id="date" 
                          className="rounded-sm px-4 py-3 mt-3 focus:outline-none bg-gray-100 w-full"
                          onChange={(e) => setFormData({...formData, ...{date: e.target.value}})}
                        >
                          <option>Feb 26th 2021</option>
                          <option>March 26th 2021</option>
                        </select>
                    </div>

                    {/* name */}
                    <div className="my-5 text-sm">
                        <label htmlFor="name" className="block text-black">Name</label>
                        <input 
                          type="text" 
                          id="name" 
                          className="rounded-sm px-4 py-3 mt-3 focus:outline-none bg-gray-100 w-full" 
                          placeholder="What is your name?" 
                          onChange={(e) => setFormData({...formData, ...{speaker: e.target.value}})}
                        />
                    </div>

                    {/* title */}
                    <div className="my-5 text-sm">
                        <label htmlFor="title" className="block text-black">Title</label>
                        <input type="text" id="title" 
                          className="rounded-sm px-4 py-3 mt-3 focus:outline-none bg-gray-100 w-full" placeholder="What is your talk about?" 
                          onChange={(e) => setFormData({...formData, ...{title: e.target.value}})}
                        />
                    </div>

                    {/* length */}
                    <div className="my-5 text-sm">
                        <label htmlFor="length" className="block text-black">Length</label>
                        <input type="text" id="length" className="rounded-sm px-4 py-3 mt-3 focus:outline-none bg-gray-100 w-full" placeholder="How long is your talk?" 
                          onChange={(e) => setFormData({...formData, ...{length: e.target.value}})}
                        />

                    </div>

                    <button 
                      className="block text-center text-white bg-gray-800 p-3 duration-300 rounded-sm hover:bg-black w-full"
                      type="submit"
                    >Submit</button>
                </form>
                ) : (
                    <button 
                      className="block text-center text-white bg-gray-800 p-3 duration-300 rounded-sm hover:bg-black w-full mt-8"
                      onClick={login}
                    >Login</button>
                )}
            </div>
        </div>
      </section>

    </div>
  );
}

export default App;
