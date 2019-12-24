describe('About Page', () => {
  beforeEach(function() {
    // create user, if doesn't already exist
    cy.request('/test/db/seed-user')
      .its('body')
      .as('currentUser');
  });

  it('can navigate to about page from home (logged out)', function() {
    cy.visit('/logout');
    cy.get('#about-page-cta').click();
    cy.url().should('include', '/about');
  });

  it('can navigate to about page from home (logged in)', function() {
    const { email, password } = this.currentUser;
    cy.request('POST', '/login', { email, password });
    cy.visit('/');
    cy.get('#menu-notch').click();
    cy.get('#menu-about-link').click();
    cy.url().should('include', '/about');
  });
});
