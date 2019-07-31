const sinon = require('sinon');
const { mockReq, mockRes } = require('sinon-express-mock');

const { list, byID, update, add } = require('./commands');

describe('artifact-api list', () => {
  let req;
  let res;

  let mockDB;

  beforeEach(() => {
    mockDB = {
      connect: jest.fn(() => {
        return {
          query: jest.fn(),
          release: jest.fn(),
        }
      }),
    }

    req = mockReq({
      app: {
        get: () => {
          return mockDB;
        }
      }
    });

    res = mockRes();
  });

  it('does something', () => {
    list(req, res);
    expect(mockDB.connect).toBeCalled();
  })
})