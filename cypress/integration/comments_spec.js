describe('Comments', function() {
  before(function() {
    cy.request('/test/db/reset');
  });

  beforeEach(function() {
    // create user, if doesn't already exist
    cy.request('/test/db/seed-user')
      .its('body')
      .as('currentUser');
  });
  it('can comment and view comments on an artifact', function() {
    cy.login(this.currentUser);
    cy.request('POST', '/api/artifact/add', {
      name: 'existing artifact',
      body: `existing artifact
      body has multiple lines
easy to read...`,
    }).then(exisingArtifact => {
      cy.visit(`/artifact/${exisingArtifact.body.id}`);
      cy.selectArtifactText();

      cy.get('#artifact-comment').contains('Joe Example');
      cy.getByTestID('comment-input')
        .find('textarea')
        .first()
        .type('My comment');
      cy.getByTestID('comment-save').click();

      cy.get('#artifact-comment').contains('Joe Example');
      cy.get('#artifact-comment').contains('My comment');

      cy.getByTestID('comment-close').click();
      cy.get('#artifact-content')
        .find('mark')
        .first()
        .click();

      cy.get('#artifact-comment').contains('Joe Example');
      cy.get('#artifact-comment').contains('My comment');
    });
  });
});
