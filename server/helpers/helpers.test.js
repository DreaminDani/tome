/* eslint-env jest */

const helpers = require('.');

describe('restrictAccess', () => {
  it('redirects to login, if not authenticated', () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    };

    const res = {
      redirect: jest.fn(),
    };
    const next = jest.fn();

    helpers.restrictAccess(req, res, next);
    expect(req.isAuthenticated).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/login');
    expect(next).not.toHaveBeenCalled();
  });

  it('does not redirect, if logged in', () => {
    const req = {
      isAuthenticated: jest.fn(() => true),
    };

    const res = {
      redirect: jest.fn(),
    };
    const next = jest.fn();

    helpers.restrictAccess(req, res, next);
    expect(req.isAuthenticated).toHaveBeenCalled();
    expect(res.redirect).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});

describe('ensureAuthenticated', () => {
  it('sends a 401 status, if not authenticated', () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    };

    const res = {
      sendStatus: jest.fn(),
    };
    const next = jest.fn();

    helpers.ensureAuthenticated(req, res, next);
    expect(req.isAuthenticated).toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('does not send a status, if logged in', () => {
    const req = {
      isAuthenticated: jest.fn(() => true),
    };

    const res = {
      sendStatus: jest.fn(),
    };
    const next = jest.fn();

    helpers.ensureAuthenticated(req, res, next);
    expect(req.isAuthenticated).toHaveBeenCalled();
    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
