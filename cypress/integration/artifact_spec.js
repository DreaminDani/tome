describe('Artifact', function() {
  before(function() {
    cy.request('/test/db/reset');
  });

  beforeEach(function() {
    // create user, if doesn't already exist
    cy.request('/test/db/seed-user')
      .its('body')
      .as('currentUser');
  });

  it('can create an artifact', function() {
    cy.login(this.currentUser);
    cy.visit('/');
    cy.get('#create-artifact').click();

    cy.url().should('include', '/edit');

    cy.get('h1').should('contain', 'New Artifact');

    cy.get('#outlined-name').type('test artifact');
    cy.get('#outlined-body').type(`test body
    is a poem`);
    cy.get('#save-artifact').click();

    cy.url().should('include', '/artifact');
    cy.get('h4').should('contain', 'test artifact');
    cy.get('p').should('contain', 'test body');
  });

  it('can edit artifact', function() {
    cy.login(this.currentUser);
    cy.request('POST', '/api/artifact/add', {
      name: 'existing artifact',
      body: `existing artifact
      body has multiple lines
easy to read...`,
    }).then(exisingArtifact => {
      // find existing artifact
      cy.visit('/');
      cy.get(`#${exisingArtifact.body.id}`).click();

      // edit artifact
      cy.get('#edit-artifact-button').click();
      cy.get('#outlined-name').type(' editing');
      cy.get('#outlined-body').type(' edit artifact ');
      cy.get('#save-artifact').click();

      cy.url().should('include', '/artifact');
      cy.get('h4').should('contain', 'editing');
      cy.get('p').should('contain', 'edit artifact');
    });
  });
});
