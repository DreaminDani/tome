describe('Artifact', function() {
  beforeEach(function() {
    // create user, if doesn't already exist
    cy.request('/test/db/seed-user')
      .its('body')
      .as('currentUser');
  });

  it('can create an artifact', function() {
    cy.login(this.currentUser);
    cy.visit('/');
  });
});
