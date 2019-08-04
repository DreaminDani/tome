/* eslint-env jest */

const { mockReq, mockRes } = require('sinon-express-mock');

const { _commitUserToDatabase, callback, logout } = require('./commands');

let req;
let res;
let next;
let mockDB;
let mockClient;

const fakeUser = {
  id: 'some-auth-string',
  _json: {},
};

beforeEach(() => {
  res = mockRes({
    redirect: jest.fn(),
    status: jest.fn(),
    send: jest.fn(),
  });
  mockClient = {
    release: jest.fn(),
  };
  next = jest.fn();
});

describe('_commitUserToDatabase', () => {
  it('handles error and does not continue login', async () => {
    mockDB = {
      connect: jest.fn(),
    };
    req = mockReq({
      app: {
        get: () => mockDB,
      },
      logIn: jest.fn((user, cb) => {
        cb('error');
      }),
    });

    await _commitUserToDatabase(req, res, next, 'error', fakeUser);

    expect(next).toBeCalledWith('error');
    expect(mockDB.connect).not.toBeCalled();
  });

  it('returns an error, if query fails', async () => {
    mockClient.query = jest.fn(() => {
      throw new Error();
    });
    mockDB = {
      connect: jest.fn(() => mockClient),
    };
    req = mockReq({
      app: {
        get: () => mockDB,
      },
    });

    await _commitUserToDatabase(req, res, next, null, fakeUser);

    expect(mockDB.connect).toBeCalled();
    expect(mockClient.query).toBeCalled();
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith({ error: 'Server Error' });
    expect(mockClient.release).toBeCalled();
  });

  it('creates a new user, if user does not exist', async () => {
    mockClient.query = jest.fn(() => ({ rows: [] }));
    mockDB = {
      connect: jest.fn(() => mockClient),
    };
    req = mockReq({
      app: {
        get: () => mockDB,
      },
      logIn: jest.fn((user, cb) => {
        cb(null);
      }),
    });

    await _commitUserToDatabase(req, res, next, null, fakeUser);

    expect(mockDB.connect).toBeCalled();
    expect(mockClient.query).toHaveBeenCalledTimes(2);
    expect(mockClient.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT'),
      [fakeUser.id]
    );
    expect(mockClient.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT'),
      expect.any(Array)
    );
    expect(mockClient.release).toBeCalled();
  });

  it('updates an existing user', async () => {
    mockClient.query = jest.fn(() => ({ rows: [{ id: 1 }] }));
    mockDB = {
      connect: jest.fn(() => mockClient),
    };
    req = mockReq({
      app: {
        get: () => mockDB,
      },
      logIn: jest.fn((user, cb) => {
        cb(null);
      }),
    });

    await _commitUserToDatabase(req, res, next, null, fakeUser);

    expect(mockDB.connect).toBeCalled();
    expect(mockClient.query).toHaveBeenCalledTimes(2);
    expect(mockClient.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT'),
      [fakeUser.id]
    );
    expect(mockClient.query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE'),
      expect.any(Array)
    );
    expect(mockClient.release).toBeCalled();
  });
});

describe('authRoutes callback', () => {
  it('handles errors', () => {
    callback(req, res, next, 'error');
    expect(next).toBeCalledWith('error');
  });

  it('redirects to login if user is not given', () => {
    callback(req, res, next, null, null);
    expect(res.redirect).toBeCalledWith('/login');
  });

  it('calls logIn with the user details', () => {
    mockDB = {
      connect: jest.fn(),
    };
    req = mockReq({
      app: {
        get: () => mockDB,
      },
      logIn: jest.fn((user, cb) => {
        cb(null);
      }),
    });

    callback(req, res, next, null, fakeUser);

    expect(req.logIn).toBeCalledWith(fakeUser, expect.any(Function));
  });

  it('redirects to /, after logIn complete', async () => {
    mockDB = {
      connect: jest.fn(),
    };
    req = mockReq({
      app: {
        get: () => mockDB,
      },
      logIn: jest.fn((user, cb) => {
        cb(null);
      }),
    });

    await callback(req, res, next, null, fakeUser);

    expect(res.redirect).toBeCalledWith('/');
  });
});

describe('authRoutes logout', () => {
  beforeAll(() => {
    req = mockReq({
      logout: jest.fn(),
    });
  });

  it('calls logout on the request', () => {
    logout(req, res);
    expect(req.logout).toHaveBeenCalled();
  });

  it('redirects to a provider url', () => {
    logout(req, res);
    expect(res.redirect).toBeCalledWith(expect.stringContaining('/logout'));
  });
});
