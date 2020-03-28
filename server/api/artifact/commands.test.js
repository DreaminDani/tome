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
  newArtifactVersion,
  createArtifact,
} = require('../../data/artifacts');

jest.mock('../../data/users');
const { getUserByEmail } = require('../../data/users');

jest.mock('../../data/comments');
const {
  addNewCommentToArtifact,
  updateCommentInArtifact,
} = require('../../data/comments');

jest.mock('../../helpers');
const { serverError, getEmailFromAuthProvider } = require('../../helpers');

let req;
let res;
let mockClient;

const fakeArtifacts = [
  {
    id: 'some-id',
    user_id: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    artifact_data: { body: 'artifact body', name: 'artifact' },
  },
];
const fakeComments = [{ test: 'comment' }];
const fakeError = new Error();
const fakeEmail = 'email@fake.com';
getEmailFromAuthProvider.mockImplementation(() => fakeEmail);

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
    getArtifactsByUser.mockImplementation(() => fakeArtifacts);

    await list(req, res);

    expect(getArtifactsByUser).toBeCalledWith(mockClient, fakeEmail);
    expect(res.send).toBeCalledWith({ list: fakeArtifacts });
    expect(mockClient.release).toBeCalled();

    getArtifactsByUser.mockReset();
  });

  it('returns an error, if query fails', async () => {
    getArtifactsByUser.mockImplementation(() => {
      throw fakeError;
    });

    await list(req, res);

    expect(getArtifactsByUser).toBeCalledWith(mockClient, fakeEmail);
    expect(serverError).toBeCalledWith(req, res, fakeError);
    expect(res.send).not.toBeCalledWith({ list: fakeArtifacts });
    expect(mockClient.release).toBeCalled();

    getArtifactsByUser.mockReset();
  });
});

describe('artifactAPI byID', () => {
  it('returns a single artifact, after retrieving from database', async () => {
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
      throw fakeError;
    });

    await byID(req, res);

    expect(getArtifactByID).toBeCalledWith(mockClient, req.params.id);
    expect(serverError).toBeCalledWith(req, res, fakeError);
    expect(res.send).not.toBeCalledWith(fakeArtifacts[0]);
    expect(mockClient.release).toBeCalled();

    getArtifactByID.mockReset();
  });
});

describe('artifactAPI update', () => {
  const fakeArtifactRequest = {
    id: 'some-uuid',
    name: 'some name',
    body: 'some body',
  };
  const fakeUserRequest = { id: 'some-user-id' };
  const fakeUser = { id: 1 };

  it('returns all artifact versions, after updating successfully', async () => {
    req.user = fakeUserRequest;
    req.body = fakeArtifactRequest;
    getUserByEmail.mockImplementation(() => fakeUser);
    newArtifactVersion.mockImplementation(() => fakeArtifacts[0]);

    await update(req, res);

    expect(getUserByEmail).toHaveBeenCalledWith(mockClient, fakeEmail);
    expect(newArtifactVersion).toHaveBeenCalledWith(
      mockClient,
      req.body.id,
      fakeUser.id,
      req.body.name,
      req.body.body
    );
    expect(res.send).toHaveBeenCalledWith(fakeArtifacts[0]);
    expect(mockClient.release).toBeCalled();

    getUserByEmail.mockReset();
    newArtifactVersion.mockReset();
  });

  it('returns an error, if update fails', async () => {
    req.user = fakeUserRequest;
    req.body = fakeArtifactRequest;
    getUserByEmail.mockImplementation(() => fakeUser);
    newArtifactVersion.mockImplementation(() => {
      throw fakeError;
    });

    await update(req, res);

    expect(newArtifactVersion).toHaveBeenCalledWith(
      mockClient,
      req.body.id,
      fakeUser.id,
      req.body.name,
      req.body.body
    );
    expect(serverError).toBeCalledWith(req, res, fakeError);
    expect(res.send).not.toBeCalledWith(fakeArtifacts[0]);
    expect(mockClient.release).toBeCalled();

    getUserByEmail.mockReset();
    newArtifactVersion.mockReset();
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

    expect(getUserByEmail).toHaveBeenCalledWith(mockClient, fakeEmail);
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
      throw fakeError;
    });
    createArtifact.mockImplementation(() => jest.fn());
    await add(req, res);

    expect(getUserByEmail).toHaveBeenCalledWith(mockClient, fakeEmail);
    expect(createArtifact).not.toHaveBeenCalled();
    expect(serverError).toBeCalledWith(req, res, fakeError);
    expect(res.send).not.toBeCalledWith(fakeArtifacts[0]);
    expect(mockClient.release).toBeCalled();

    getUserByEmail.mockReset();
    createArtifact.mockReset();
  });

  it('handles errors when saving the artifact', async () => {
    req.user = fakeUserRequest;
    req.body = fakeArtifactRequest;

    getUserByEmail.mockImplementation(() => fakeUser);
    createArtifact.mockImplementation(() => {
      throw fakeError;
    });
    await add(req, res);

    expect(getUserByEmail).toHaveBeenCalledWith(mockClient, fakeEmail);
    expect(createArtifact).toHaveBeenCalledWith(
      mockClient,
      fakeUser.id,
      req.body.name,
      req.body.body
    );
    expect(serverError).toBeCalledWith(req, res, fakeError);
    expect(res.send).not.toBeCalledWith(fakeArtifacts[0]);
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

    expect(getUserByEmail).toHaveBeenCalledWith(mockClient, fakeEmail);
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
      throw fakeError;
    });
    addNewCommentToArtifact.mockImplementation(() => jest.fn());
    await addComment(req, res);

    expect(getUserByEmail).toHaveBeenCalledWith(mockClient, fakeEmail);
    expect(addNewCommentToArtifact).not.toHaveBeenCalled();
    expect(serverError).toBeCalledWith(req, res, fakeError);
    expect(res.send).not.toBeCalledWith(fakeComments);
    expect(mockClient.release).toBeCalled();

    getUserByEmail.mockReset();
    addNewCommentToArtifact.mockReset();
  });

  it('handles errors when saving the comment', async () => {
    req.user = fakeUserRequest;
    req.body = fakeCommentRequest;

    getUserByEmail.mockImplementation(() => fakeUser);
    addNewCommentToArtifact.mockImplementation(() => {
      throw fakeError;
    });
    await addComment(req, res);

    expect(getUserByEmail).toHaveBeenCalledWith(mockClient, fakeEmail);
    expect(addNewCommentToArtifact).toHaveBeenCalledWith(
      mockClient,
      fakeUser.id,
      fakeUser.auth_metadata.name,
      req.body.comment,
      req.body.location,
      req.body.id
    );
    expect(serverError).toBeCalledWith(req, res, fakeError);
    expect(res.send).not.toBeCalledWith(fakeComments);
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

    expect(getUserByEmail).toHaveBeenCalledWith(mockClient, fakeEmail);
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
      throw fakeError;
    });
    updateCommentInArtifact.mockImplementation(() => jest.fn());
    await updateComment(req, res);

    expect(getUserByEmail).toHaveBeenCalledWith(mockClient, fakeEmail);
    expect(updateCommentInArtifact).not.toHaveBeenCalled();
    expect(serverError).toBeCalledWith(req, res, fakeError);
    expect(res.send).not.toBeCalledWith(fakeComments);
    expect(mockClient.release).toBeCalled();

    getUserByEmail.mockReset();
    updateCommentInArtifact.mockReset();
  });

  it('handles errors when saving the comment', async () => {
    req.user = fakeUserRequest;
    req.body = fakeCommentRequest;

    getUserByEmail.mockImplementation(() => fakeUser);
    updateCommentInArtifact.mockImplementation(() => {
      throw fakeError;
    });
    await updateComment(req, res);

    expect(getUserByEmail).toHaveBeenCalledWith(mockClient, fakeEmail);
    expect(updateCommentInArtifact).toHaveBeenCalledWith(
      mockClient,
      fakeUser.id,
      fakeUser.auth_metadata.name,
      req.body.comment,
      req.body.commentID,
      req.body.id
    );
    expect(serverError).toBeCalledWith(req, res, fakeError);
    expect(res.send).not.toBeCalledWith(fakeComments);
    expect(mockClient.release).toBeCalled();

    getUserByEmail.mockReset();
    updateCommentInArtifact.mockReset();
  });
});
