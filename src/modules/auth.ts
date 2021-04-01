import netlifyIdentity from 'netlify-identity-widget'
import netlifyAuth from '../netlifyAuth'

export const login = async (
  authenticator: typeof netlifyAuth,
  setUser: (user: netlifyIdentity.User) => void,
  setLoggedIn: (value: boolean) => void
) => {
  authenticator.authenticate((user: netlifyIdentity.User) => {
    setLoggedIn(!!user)
    setUser(user)
  })
}
