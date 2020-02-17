describe('Artifact', function() {
  beforeEach(function() {
    cy.request('/test/db/reset');
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

  it.only('can edit artifact', function() {
    cy.login(this.currentUser);
    cy.request('POST', '/api/artifact/add', {
      name: 'existing artifact',
      body: `existing artifact
      body has multiple lines
easy to read...`,
    }).then(exisingArtifact => {
      cy.visit(`/artifact/${exisingArtifact.body.id}`);

      cy.get('#edit-artifact-button').click();
      cy.get('#outlined-name').type(' editing');
      cy.get('#outlined-body').type(' edit artifact ');
      cy.get('#save-artifact').click();

      // add comment
      // TODO

      // verify artifact saved
      cy.url().should('include', '/artifact');
      cy.get('h4').should('contain', 'editing');
      cy.get('p').should('contain', 'edit artifact');

      // verify new version has been created
      cy.getByTestID('artifact-version')
        .find('input')
        .should('have.value', '1');

      // look at previous version
      cy.getByTestID('artifact-version')
        .find('.MuiSlider-markLabel')
        .first()
        .click();
      cy.getByTestID('artifact-version')
        .find('input')
        .should('have.value', '0');
      cy.url().should('include', 'version=1');
      cy.get('h4').should('not.contain', 'editing');
      cy.get('p').should('not.contain', 'edit artifact');

      // use URL to navigate
      cy.visit(`/artifact/${exisingArtifact.body.id}?version=1`);
      cy.getByTestID('artifact-version')
        .find('input')
        .should('have.value', '0');
      cy.get('h4').should('not.contain', 'editing');
      cy.get('p').should('not.contain', 'edit artifact');

      // note that Edit is disabled
      cy.get('#edit-artifact-button').should('be.disabled');

      // return to current version
      cy.getByTestID('artifact-version')
        .find('.MuiSlider-markLabel')
        .last()
        .click();
      // edit current version
      cy.get('#edit-artifact-button').click();
      cy.get('#outlined-name').type(' more edits');
      cy.get('#outlined-body').type(' for the third time... ');

      // save new edit and verify version saved
      cy.get('#save-artifact').click();
      cy.getByTestID('artifact-version')
        .find('input')
        .should('have.value', '3');
      cy.get('h4').should('contain', 'editing');
      cy.get('p').should('contain', 'edit artifact');

      // add comment
      // TODO
    });
  });

  it('can navigate between the artifact and home page', function() {
    cy.login(this.currentUser);
    cy.request('POST', '/api/artifact/add', {
      name: 'some artifact',
      body: 'artifact body',
    }).then(exisingArtifact => {
      // find existing artifact
      cy.visit('/');
      cy.get(`#${exisingArtifact.body.id}`).click();
      cy.location('pathname', { timeout: 2000 }).should(
        'include',
        exisingArtifact.body.id
      );

      cy.get('#menu-notch').click();
      cy.get('#menu-home-link').click();

      cy.get('h1').should('contain', 'My Artifacts');
    });
  });
});
