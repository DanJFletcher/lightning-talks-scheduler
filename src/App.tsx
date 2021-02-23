import { useEffect, useState } from 'react';
import netlifyAuth from './netlifyAuth';
import './App.css';
import netlifyIdentity from 'netlify-identity-widget'

const talks = [
  {
    speaker: 'Colin Decarlo',
    title: 'How to deliver a tech talk',
    start: '3:30',
    end: '3:45'
  },
  {
    speaker: 'Deep Panchel',
    title: 'Hasura backends',
    start: '3:45',
    end: '4:00'
  },
  {
    speaker: 'Andrew Nobel',
    title: `You won't believe this one simple trick to increase your unix productivity (sysadmins HATE it)`,
    start: '4:00',
    end: '4:15'
  }
]

function App() {
  const [user, setUser] = useState<netlifyIdentity.User | null>(null)
  const [loggedIn, setLoggedIn] = useState(netlifyAuth.isAuthenticated)

  useEffect(() => {
    netlifyAuth.initialize((user: netlifyIdentity.User) => {
      setLoggedIn(!!user)
    })
  }, [loggedIn])

  let login = () => {
    netlifyAuth.authenticate((user: netlifyIdentity.User) => {
      setLoggedIn(!!user)
      setUser(user)
    })
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let logout = () => {
    netlifyAuth.signout(() => {
      setLoggedIn(false)
      setUser(null)
    })
  }

  return (
    <div className="App bg-gray-100 pt-6 pb-16">
      <p>{loggedIn ? `You're signed in as: ${user?.email}` : ""}</p>
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

                <form action="" className="mt-6 text-left">

                    {/* Date */}
                    <div className="my-5 text-sm">
                        <label htmlFor="date" className="block text-black">Date</label>
                        <select id="date" className="rounded-sm px-4 py-3 mt-3 focus:outline-none bg-gray-100 w-full">
                          <option>Feb 26th 2021</option>
                          <option>March 26th 2021</option>
                        </select>
                    </div>

                    {/* name */}
                    <div className="my-5 text-sm">
                        <label htmlFor="name" className="block text-black">Name</label>
                        <input type="text" id="name" className="rounded-sm px-4 py-3 mt-3 focus:outline-none bg-gray-100 w-full" placeholder="What is your name?" />
                    </div>

                    {/* title */}
                    <div className="my-5 text-sm">
                        <label htmlFor="title" className="block text-black">Title</label>
                        <input type="text" id="title" className="rounded-sm px-4 py-3 mt-3 focus:outline-none bg-gray-100 w-full" placeholder="What is your talk about?" />
                    </div>

                    {/* length */}
                    <div className="my-5 text-sm">
                        <label htmlFor="length" className="block text-black">Length</label>
                        <input type="text" id="length" className="rounded-sm px-4 py-3 mt-3 focus:outline-none bg-gray-100 w-full" placeholder="How long is your talk?" />
                    </div>

                    <button className="block text-center text-white bg-gray-800 p-3 duration-300 rounded-sm hover:bg-black w-full">Submit</button>
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
