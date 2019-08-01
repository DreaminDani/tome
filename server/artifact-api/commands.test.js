const sinon = require('sinon');
const { mockReq, mockRes } = require('sinon-express-mock');

const { list, byID, update, add } = require('./commands');

let req;
let res;
let mockDB;
let mockClient;

beforeEach(() => {
  res = mockRes({
    send: jest.fn(),
  });
  mockClient = {
    release: jest.fn(),
  };
});

describe('artifact-api list', () => {
  const fakeArtifacts = { rows: [{ test: 'value' }] };

  it('returns a list of artifacts', async () => {
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
    expect(res.send).toBeCalledWith({ error: 'internal server error' });
  });
});
