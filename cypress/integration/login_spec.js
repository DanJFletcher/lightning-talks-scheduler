describe('Login', () => {
  it('clicking "login" opens iframe', () => {
    cy.visit('/')

    cy.get('iframe')
  })
})
