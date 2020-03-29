// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
function triggerComment(element) {
  cy.get(element)
    .trigger('mousedown')
    .then(($el) => {
      const el = $el[0];
      const document = el.ownerDocument;
      const range = document.createRange();
      range.selectNodeContents(el);
      document.getSelection().removeAllRanges(range);
      document.getSelection().addRange(range);
    })
    .trigger('mouseup');
  cy.document().trigger('selectionchange');
}

Cypress.Commands.add('selectArtifactText', () =>
  triggerComment('#artifact-content')
);

Cypress.Commands.add('login', (user) => {
  const { email, password } = user;
  cy.request('POST', '/login', { email, password });
});

Cypress.Commands.add('getByTestID', (testID) =>
  cy.get(`[data-testid="${testID}"]`)
);
