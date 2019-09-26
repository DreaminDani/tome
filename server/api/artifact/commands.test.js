/* eslint-env jest */

const { mockReq, mockRes } = require('sinon-express-mock');

const {
  list,
  byID,
  update,
  add,
  addComment,
  updateComment,
} = require('./commands');

jest.mock('../../data/artifacts');
const {
  getArtifactsByUser,
  getArtifactByID,
  updateArtifactByID,
  createArtifact,
} = require('../../data/artifacts');

jest.mock('../../data/users');
const { getUserByEmail } = require('../../data/users');

jest.mock('../../data/comments');
const {
  addNewCommentToArtifact,
  updateCommentInArtifact,
} = require('../../data/comments');

let req;
let res;
let mockClient;

const fakeArtifacts = [{ test: 'artifact' }];
const fakeComments = [{ test: 'comment' }];

beforeEach(() => {
  res = mockRes({
    send: jest.fn(),
    status: jest.fn(),
  });
  mockClient = {
    release: jest.fn(),
  };
  req = mockReq({
    app: {
      get: () => ({
        connect: jest.fn(() => mockClient),
      }),
    },
  });
});

describe('artifactAPI list', () => {
  it('returns a list of artifacts, after retrieving from database', async () => {
    req.user = { id: 'some-user-id' }; // all these tests need to change to use email...
    getArtifactsByUser.mockImplementation(() => fakeArtifacts);

    await list(req, res);

    expect(getArtifactsByUser).toBeCalledWith(mockClient, req.user.id);
    expect(res.send).toBeCalledWith({ list: fakeArtifacts });
    expect(mockClient.release).toBeCalled();

    getArtifactsByUser.mockReset();
  });

  it('returns an error, if query fails', async () => {
    req.user = { id: 'some-user-id' };
    getArtifactsByUser.mockImplementation(() => {
      throw new Error();
    });

    await list(req, res);

    expect(getArtifactsByUser).toBeCalledWith(mockClient, req.user.id);
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith({ error: 'Server Error' });
    expect(res.send).not.toBeCalledWith({ list: fakeArtifacts });
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(mockClient.release).toBeCalled();

    getArtifactsByUser.mockReset();
  });
});

describe('artifactAPI byID', () => {
  it('returns a single artifact, after retrieving from database', async () => {
    req.params.id = 'some-uuid';
    getArtifactByID.mockImplementation(() => fakeArtifacts[0]);

    await byID(req, res);

    expect(getArtifactByID).toBeCalledWith(mockClient, req.params.id);
    expect(res.send).toBeCalledWith(fakeArtifacts[0]);
    expect(mockClient.release).toBeCalled();

    getArtifactByID.mockReset();
  });

  it('returns an error, if query fails', async () => {
    req.params.id = 'some-uuid';
    getArtifactByID.mockImplementation(() => {
      throw new Error();
    });

    await byID(req, res);

    expect(getArtifactByID).toBeCalledWith(mockClient, req.params.id);
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith({ error: 'Server Error' });
    expect(res.send).not.toBeCalledWith(fakeArtifacts[0]);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(mockClient.release).toBeCalled();

    getArtifactByID.mockReset();
  });
});

describe('artifactAPI update', () => {
  it('returns a single artifact, after updating successfully', async () => {
    req.body = { id: 'some-uuid', name: 'some name', body: 'some body' };
    updateArtifactByID.mockImplementation(() => fakeArtifacts[0]);

    await update(req, res);

    expect(updateArtifactByID).toBeCalledWith(
      mockClient,
      req.body.id,
      req.body.name,
      req.body.body
    );
    expect(res.send).toBeCalledWith(fakeArtifacts[0]);
    expect(mockClient.release).toBeCalled();

    updateArtifactByID.mockReset();
  });

  it('returns an error, if update fails', async () => {
    req.body = { id: 'some-uuid', name: 'some name', body: 'some body' };
    updateArtifactByID.mockImplementation(() => {
      throw new Error();
    });

    await update(req, res);

    expect(updateArtifactByID).toBeCalledWith(
      mockClient,
      req.body.id,
      req.body.name,
      req.body.body
    );
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith({ error: 'Server Error' });
    expect(res.send).not.toBeCalledWith(fakeArtifacts[0]);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(mockClient.release).toBeCalled();

    updateArtifactByID.mockReset();
  });
});

describe('artifactAPI add', () => {
  const fakeArtifactRequest = { name: 'some name', body: 'some body' };
  const fakeUserRequest = { id: 'some-user-id' };
  const fakeUser = { id: 1 };

  it('returns a single artifact, if saved successfully', async () => {
    req.user = fakeUserRequest;
    req.body = fakeArtifactRequest;
    getUserByEmail.mockImplementation(() => fakeUser);
    createArtifact.mockImplementation(() => fakeArtifacts[0]);

    await add(req, res);

    expect(getUserByEmail).toHaveBeenCalledWith(mockClient, req.user.id);
    expect(createArtifact).toHaveBeenCalledWith(
      mockClient,
      fakeUser.id,
      req.body.name,
      req.body.body
    );
    expect(res.send).toHaveBeenCalledWith(fakeArtifacts[0]);
    expect(mockClient.release).toBeCalled();

    getUserByEmail.mockReset();
    createArtifact.mockReset();
  });

  it('handles errors when retrieving user info', async () => {
    req.user = fakeUserRequest;
    getUserByEmail.mockImplementation(() => {
      throw new Error();
    });
    createArtifact.mockImplementation(() => jest.fn());
    await add(req, res);

    expect(getUserByEmail).toHaveBeenCalledWith(mockClient, req.user.id);
    expect(createArtifact).not.toHaveBeenCalled();
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith({ error: 'Server Error' });
    expect(res.send).not.toBeCalledWith(fakeArtifacts[0]);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(mockClient.release).toBeCalled();

    getUserByEmail.mockReset();
    createArtifact.mockReset();
  });

  it('handles errors when saving the artifact', async () => {
    req.user = fakeUserRequest;
    req.body = fakeArtifactRequest;

    getUserByEmail.mockImplementation(() => fakeUser);
    createArtifact.mockImplementation(() => {
      throw new Error();
    });
    await add(req, res);

    expect(getUserByEmail).toHaveBeenCalledWith(mockClient, req.user.id);
    expect(createArtifact).toHaveBeenCalledWith(
      mockClient,
      fakeUser.id,
      req.body.name,
      req.body.body
    );
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith({ error: 'Server Error' });
    expect(res.send).not.toBeCalledWith(fakeArtifacts[0]);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(mockClient.release).toBeCalled();

    getUserByEmail.mockReset();
    createArtifact.mockReset();
  });
});

describe('artifactAPI addComment', () => {
  const fakeUserRequest = { id: 'some-user-id' };
  const fakeCommentRequest = {
    comment: 'some comment',
    location: [1, 0],
    id: 'the-artifact-id',
  };
  const fakeUser = { id: 1, auth_metadata: { name: 'Fake User' } };

  it('returns the new list of comments, if saved successfully', async () => {
    req.user = fakeUserRequest;
    req.body = fakeCommentRequest;
    getUserByEmail.mockImplementation(() => fakeUser);
    addNewCommentToArtifact.mockImplementation(() => fakeComments);

    await addComment(req, res);

    expect(getUserByEmail).toHaveBeenCalledWith(mockClient, req.user.id);
    expect(addNewCommentToArtifact).toHaveBeenCalledWith(
      mockClient,
      fakeUser.id,
      fakeUser.auth_metadata.name,
      req.body.comment,
      req.body.location,
      req.body.id
    );
    expect(res.send).toHaveBeenCalledWith(fakeComments);
    expect(mockClient.release).toBeCalled();

    getUserByEmail.mockReset();
    addNewCommentToArtifact.mockReset();
  });

  it('handles errors when retrieving user info', async () => {
    req.user = fakeUserRequest;
    getUserByEmail.mockImplementation(() => {
      throw new Error();
    });
    addNewCommentToArtifact.mockImplementation(() => jest.fn());
    await addComment(req, res);

    expect(getUserByEmail).toHaveBeenCalledWith(mockClient, req.user.id);
    expect(addNewCommentToArtifact).not.toHaveBeenCalled();
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith({ error: 'Server Error' });
    expect(res.send).not.toBeCalledWith(fakeComments);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(mockClient.release).toBeCalled();

    getUserByEmail.mockReset();
    addNewCommentToArtifact.mockReset();
  });

  it('handles errors when saving the comment', async () => {
    req.user = fakeUserRequest;
    req.body = fakeCommentRequest;

    getUserByEmail.mockImplementation(() => fakeUser);
    addNewCommentToArtifact.mockImplementation(() => {
      throw new Error();
    });
    await addComment(req, res);

    expect(getUserByEmail).toHaveBeenCalledWith(mockClient, req.user.id);
    expect(addNewCommentToArtifact).toHaveBeenCalledWith(
      mockClient,
      fakeUser.id,
      fakeUser.auth_metadata.name,
      req.body.comment,
      req.body.location,
      req.body.id
    );
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith({ error: 'Server Error' });
    expect(res.send).not.toBeCalledWith(fakeComments);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(mockClient.release).toBeCalled();

    getUserByEmail.mockReset();
    addNewCommentToArtifact.mockReset();
  });
});

describe('artifactAPI updateComment', () => {
  const fakeUserRequest = { id: 'some-user-id' };
  const fakeCommentRequest = {
    commentID: 'the-comment-id',
    comment: 'some comment',
    id: 'the-artifact-id',
  };
  const fakeUser = { id: 1, auth_metadata: { name: 'Fake User' } };

  it('returns the new list of comments, if saved successfully', async () => {
    req.user = fakeUserRequest;
    req.body = fakeCommentRequest;
    getUserByEmail.mockImplementation(() => fakeUser);
    updateCommentInArtifact.mockImplementation(() => fakeComments);

    await updateComment(req, res);

    expect(getUserByEmail).toHaveBeenCalledWith(mockClient, req.user.id);
    expect(updateCommentInArtifact).toHaveBeenCalledWith(
      mockClient,
      fakeUser.id,
      fakeUser.auth_metadata.name,
      req.body.comment,
      req.body.commentID,
      req.body.id
    );
    expect(res.send).toHaveBeenCalledWith(fakeComments);
    expect(mockClient.release).toBeCalled();

    getUserByEmail.mockReset();
    updateCommentInArtifact.mockReset();
  });

  it('handles errors when retrieving user info', async () => {
    req.user = fakeUserRequest;
    getUserByEmail.mockImplementation(() => {
      throw new Error();
    });
    updateCommentInArtifact.mockImplementation(() => jest.fn());
    await updateComment(req, res);

    expect(getUserByEmail).toHaveBeenCalledWith(mockClient, req.user.id);
    expect(updateCommentInArtifact).not.toHaveBeenCalled();
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith({ error: 'Server Error' });
    expect(res.send).not.toBeCalledWith(fakeComments);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(mockClient.release).toBeCalled();

    getUserByEmail.mockReset();
    updateCommentInArtifact.mockReset();
  });

  it('handles errors when saving the comment', async () => {
    req.user = fakeUserRequest;
    req.body = fakeCommentRequest;

    getUserByEmail.mockImplementation(() => fakeUser);
    updateCommentInArtifact.mockImplementation(() => {
      throw new Error();
    });
    await updateComment(req, res);

    expect(getUserByEmail).toHaveBeenCalledWith(mockClient, req.user.id);
    expect(updateCommentInArtifact).toHaveBeenCalledWith(
      mockClient,
      fakeUser.id,
      fakeUser.auth_metadata.name,
      req.body.comment,
      req.body.commentID,
      req.body.id
    );
    expect(res.status).toBeCalledWith(500);
    expect(res.send).toBeCalledWith({ error: 'Server Error' });
    expect(res.send).not.toBeCalledWith(fakeComments);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(mockClient.release).toBeCalled();

    getUserByEmail.mockReset();
    updateCommentInArtifact.mockReset();
  });
});
