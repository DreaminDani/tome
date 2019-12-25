describe('About Page', function() {
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

  it('shows Your Name in comment on about page as logged out user', function() {
    cy.visit('/logout');
    cy.visit('/about');

    cy.selectArtifactText();

    cy.get('#artifact-comment').contains('Your Name');
  });

  it('can navigate to about page from home (logged in)', function() {
    cy.login(this.currentUser);
    cy.visit('/');

    cy.get('#menu-notch').click();
    cy.get('#menu-about-link').click();

    cy.url().should('include', '/about');
  });

  it("shows user's name in comment on about page as logged out user", function() {
    cy.login(this.currentUser);

    cy.visit('/about');
    cy.selectArtifactText();

    cy.get('#artifact-comment').contains('Joe Example');
  });
});
