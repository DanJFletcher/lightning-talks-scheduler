describe('Login', () => {
  it('clicking "login" opens iframe', () => {
    cy.visit('/')

    cy.get('button:contains("Login")').click()

    cy.get('iframe#netlify-identity-widget')
  })

  it('can log a user in', () => {
    window.localStorage.setItem(
      'netlifySiteURL',
      'https://lightning-talk-scheduler.netlify.app/'
    )

    cy.visit('/')

    // cy.get('button:contains("Login")').click()

    // cy.frameLoaded('#netlify-identity-widget')
    let token = null
    cy.request({
      url:
        'https://lightning-talk-scheduler.netlify.app/.netlify/identity/token',
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: {
        grant_type: 'password',
        username: 'dannyjamesfletcher@gmail.com',
        password: '123456Ab!',
      },
    }).then((res) => {
      token = res.body.access_token
      cy.request({
        url:
          'https://lightning-talk-scheduler.netlify.app/.netlify/identity/user',
        method: 'GET',
        headers: {
          authorization: 'Bearer ' + token,
          'content-type': 'application/json',
        },
      })
    })
  })
})
