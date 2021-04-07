import netlifyAuth from '../netlifyAuth'
import netlifyIdentity from 'netlify-identity-widget'
import { login } from './auth'
import { userFactory } from '../tests/factories/userFactory'

describe('Auth Module', () => {
  const fakeAuth = {
    authenticate(callback) {
      callback(
        userFactory({
          user_metadata: { full_name: 'Kevin Malone' },
        })
      )
    },
  } as typeof netlifyAuth

  const noOpUser = (user: any) => null
  const noOpLoggedIn = (value: boolean) => null

  it('sets logged in user on successful log in', () => {
    // Arrange
    let user: netlifyIdentity.User | null = netlifyIdentity.currentUser()

    const setUser = (authUser: netlifyIdentity.User) => {
      user = authUser
    }

    // Act
    login(fakeAuth, setUser, noOpLoggedIn)

    // Assert
    expect(user?.user_metadata?.full_name).toBe('Kevin Malone')
  })

  it('sets "loggedIn" to "true" on successful log in', () => {
    // Arrange
    let loggedIn = false

    const setLoggedIn = (value: boolean) => {
      loggedIn = value
    }

    // Act
    login(fakeAuth, noOpUser, setLoggedIn)

    // Assert
    expect(loggedIn).toBe(true)
  })
})
