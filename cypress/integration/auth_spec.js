describe('Authentication', function () {
  before(function () {
    cy.request('/test/db/reset');
  });

  it('create an account', function () {
    cy.visit('/');

    cy.get('#firstName').type('Joe');
    cy.get('#lastName').type('Example');
    cy.get('#email').type('joe@example.com');
    cy.get('#password').type('Test123!');
    cy.get('#signup-button').click();

    cy.get('h1').should('contain', 'My Artifacts');
  });

  it('log out and login', function () {
    cy.get('#menu-notch').click();
    cy.get('#menu-logout-link').click();

    cy.get('h1').should('contain', 'Sign up');
    cy.get('#toggle-login').click();
    cy.get('h1').should('contain', 'Sign in');

    cy.get('#email').type('joe@example.com');
    cy.get('#password').type('Test123!');
    cy.get('#signin-button').click();

    cy.get('h1').should('contain', 'My Artifacts');
  });
});
