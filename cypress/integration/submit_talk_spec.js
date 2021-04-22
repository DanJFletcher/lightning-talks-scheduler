describe('submit a talk', () => {
  it('shows success message after submiting a talk successfully', () => {
    cy.visit('/')

    window.localStorage.setItem(
      'gotrue.user',
      JSON.stringify({
        url: 'https://lightning-talk-scheduler.netlify.app/.netlify/identity',
        token: {
          access_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTg4NjYxNTksInN1YiI6ImM0ODhmY2FhLTdkYTEtNDBhNS1iY2JmLWJlM2MxMmI0NDMyYyIsImVtYWlsIjoiZGFubnlqYW1lc2ZsZXRjaGVyQGdtYWlsLmNvbSIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicm9sZXMiOltdfSwidXNlcl9tZXRhZGF0YSI6eyJmdWxsX25hbWUiOiJEYW4gRmxldGNoZXIifX0.4F1Xo6vaV8Vace0W8QKkGiTWM_Qyy8CzNRI-uT6UQc0',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: '2wMnkGPTif1bH0THS9mw9A',
          expires_at: 1618866159000,
        },
        id: 'c488fcaa-7da1-40a5-bcbf-be3c12b4432c',
        aud: '',
        role: '',
        email: 'dannyjamesfletcher@gmail.com',
        confirmed_at: '2021-02-24T01:30:04Z',
        confirmation_sent_at: '2021-02-24T01:29:29Z',
        app_metadata: { provider: 'email', roles: [] },
        user_metadata: { full_name: 'Dan Fletcher' },
        created_at: '2021-02-24T01:29:29Z',
        updated_at: '2021-02-24T01:29:29Z',
      })
    )
    window.localStorage.setItem(
      'netlifySiteURL',
      'https://lightning-talk-scheduler.netlify.app/'
    )

    cy.intercept('POST', '.netlify/functions/create-talk', {
      statusCode: 204,
    })

    cy.get('input#name').type('asdf')
    cy.get('input#title').type('asdf')
    cy.get('input#length').type('asdf')
    cy.get('form').submit()

    cy.contains('Thanks for submitting your talk!')
  })
})
