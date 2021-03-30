describe('Home Page', () => {
  it('renders the page', () => {
    cy.visit('/')
  })

  it('contains the next event date', () => {
    cy.visit('/')

    cy.contains('Friday, April 30, 2021')
  })

  it('shows "no talks" if there have been no talks scheduled', () => {
    cy.visit('/')

    cy.contains('No Talks Have Been Scheduled For This Event!')
  })

  it('shows "login" button to submit a talk', () => {
    cy.visit('/')

    cy.contains('Login')
  })
})
