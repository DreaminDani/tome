/* eslint-env jest */

const { mockReq, mockRes } = require('sinon-express-mock');

const { list, byID, update, add } = require('./commands');

let req;
let res;
let mockDB;
let mockClient;

const fakeArtifacts = { rows: [{ test: 'value' }] };

beforeEach(() => {
  res = mockRes({
    send: jest.fn(),
    status: jest.fn(),
  });
  mockClient = {
    release: jest.fn(),
  };
});

describe('artifactAPI list', () => {
  it('returns a list of artifacts, after retrieving from database', async () => {
    mockClient.query = jest.fn(() => fakeArtifacts);
    mockDB = {
      connect: jest.fn(() => mockClient),
    };
    req = mockReq({
      app: {
        get: () => mockDB,
      },
      user: {
        id: 1,
      },
    });

    await list(req, res);

    expect(mockDB.connect).toBeCalled();
    expect(mockClient.query).toBeCalled();
    expect(res.send).toBeCalledWith({ list: fakeArtifacts.rows });
    expect(mockClient.release).toBeCalled();
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
      user: {
        id: 1,
      },
    });

    await list(req, res);

    expect(mockDB.connect).toBeCalled();
    expect(mockClient.query).toBeCalled();
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith({ error: 'Server Error' });
    expect(res.send).not.toBeCalledWith({ list: fakeArtifacts.rows });
    expect(mockClient.release).toBeCalled();
  });
});

describe('artifactAPI byID', () => {
  it('returns a single artifact, after retrieving from database', async () => {
    mockClient.query = jest.fn(() => fakeArtifacts);
    mockDB = {
      connect: jest.fn(() => mockClient),
    };
    req = mockReq({
      app: {
        get: () => mockDB,
      },
      params: {
        id: 1,
      },
    });

    await byID(req, res);

    expect(mockDB.connect).toBeCalled();
    expect(mockClient.query).toBeCalled();
    expect(res.send).toBeCalledWith(fakeArtifacts.rows[0]);
    expect(mockClient.release).toBeCalled();
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
      params: {
        id: 1,
      },
    });

    await byID(req, res);

    expect(mockDB.connect).toBeCalled();
    expect(mockClient.query).toBeCalled();
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith({ error: 'Server Error' });
    expect(res.send).not.toBeCalledWith(fakeArtifacts.rows[0]);
    expect(mockClient.release).toBeCalled();
  });
});

describe('artifactAPI update', () => {
  const fakeNewArtifact = {
    id: 1,
    name: 'Test Name',
    body: 'Test Body',
  };

  it('returns a single artifact, after saving to database', async () => {
    mockClient.query = jest.fn(() => fakeArtifacts);
    mockDB = {
      connect: jest.fn(() => mockClient),
    };
    req = mockReq({
      app: {
        get: () => mockDB,
      },
      body: fakeNewArtifact,
    });

    await update(req, res);

    expect(mockDB.connect).toBeCalled();
    expect(mockClient.query).toBeCalled();
    expect(res.send).toBeCalledWith(fakeArtifacts.rows[0]);
    expect(mockClient.release).toBeCalled();
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
      body: fakeNewArtifact,
    });

    await update(req, res);

    expect(mockDB.connect).toBeCalled();
    expect(mockClient.query).toBeCalled();
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith({ error: 'Server Error' });
    expect(res.send).not.toBeCalledWith(fakeArtifacts.rows[0]);
    expect(mockClient.release).toBeCalled();
  });
});

describe('artifactAPI add', () => {
  const fakeNewArtifact = {
    id: 1,
    name: 'Test Name',
    body: 'Test Body',
  };

  it('returns a single artifact, after saving to database', async () => {
    mockClient.query = jest.fn(() => fakeArtifacts);
    mockDB = {
      connect: jest.fn(() => mockClient),
    };
    req = mockReq({
      app: {
        get: () => mockDB,
      },
      body: fakeNewArtifact,
      user: {
        id: 1,
      },
    });

    await add(req, res);

    expect(mockDB.connect).toBeCalled();
    expect(mockClient.query).toBeCalled();
    expect(res.send).toBeCalledWith(fakeArtifacts.rows[0]);
    expect(mockClient.release).toBeCalled();
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
      body: fakeNewArtifact,
      user: {
        id: 1,
      },
    });

    await add(req, res);

    expect(mockDB.connect).toBeCalled();
    expect(mockClient.query).toBeCalled();
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith({ error: 'Server Error' });
    expect(res.send).not.toBeCalledWith(fakeArtifacts.rows[0]);
    expect(mockClient.release).toBeCalled();
  });
});
