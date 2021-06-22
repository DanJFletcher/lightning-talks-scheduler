import netlifyIdentity from 'netlify-identity-widget'

/**
 * Allows modifying the global window object
 * without TS compiler complaining.
 *
 * @see https://stackoverflow.com/a/12709880/5056424
 */
declare global {
  interface Window {
    netlifyIdentity: typeof netlifyIdentity
  }
}

type userCallback = (user: netlifyIdentity.User | null) => void
interface NetlifyAuth {
  isAuthenticated: boolean
  user: netlifyIdentity.User | null
  initialize: (callback: userCallback) => void
  authenticate: (callback: userCallback) => void
  signout: (callback: () => void) => void
}

const netlifyAuth: NetlifyAuth = {
  isAuthenticated: false,
  user: null,
  initialize(callback) {
    window.netlifyIdentity = netlifyIdentity
    netlifyIdentity.on('init', (user) => {
      callback(user)
    })
    netlifyIdentity.init()
  },
  authenticate(callback) {
    console.log('here')
    this.isAuthenticated = true
    netlifyIdentity.open()
    netlifyIdentity.on('login', (user) => {
      this.user = user
      callback(user)
      netlifyIdentity.close()
    })
  },
  signout(callback) {
    this.isAuthenticated = false
    netlifyIdentity.logout()
    netlifyIdentity.on('logout', () => {
      this.user = null
      callback()
      netlifyIdentity.close()
    })
  },
}

export default netlifyAuth
