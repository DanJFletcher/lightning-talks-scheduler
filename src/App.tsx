import { useEffect, useState } from 'react'
import netlifyAuth from './netlifyAuth'
import './App.css'
import netlifyIdentity from 'netlify-identity-widget'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Admin from './pages/Admin'
import Home from './pages/home/Home'
import { login as authLogin } from './modules/auth'

function App() {
  const [user, setUser] = useState<netlifyIdentity.User | null>(null)
  const [loggedIn, setLoggedIn] = useState(netlifyAuth.isAuthenticated)

  useEffect(() => {
    netlifyAuth.initialize((user: netlifyIdentity.User) => {
      setLoggedIn(!!user)
      setUser(user)
    })
  }, [])

  const login = () => {
    authLogin(netlifyAuth, setUser, setLoggedIn)
  }

  const logout = () => {
    netlifyAuth.signout(() => {
      setLoggedIn(false)
      setUser(null)
    })
  }

  return (
    <Router>
      <Switch>
        {user && user.app_metadata?.roles?.find((x) => x === 'admin') ? (
          <Route path="/admin">
            <Admin />
          </Route>
        ) : null}
        <Route path="/">
          <Home loggedIn={loggedIn} login={login} user={user} logout={logout} />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
