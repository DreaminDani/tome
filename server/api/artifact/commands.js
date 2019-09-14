const { serverError } = require('../../helpers');
const {
  getArtifactsByUser,
  getArtifactByID,
  updateArtifactByID,
  createArtifact,
} = require('../../data/artifacts');
const { getUserByID } = require('../../data/users');
const { addNewCommentToArtifact } = require('../../data/comments');

const list = async (req, res) => {
  const client = await req.app.get('db').connect();
  const artifacts = {};

  try {
    artifacts.list = await getArtifactsByUser(client, req.user.id);
  } catch (e) {
    serverError(req, res, e);
  } finally {
    client.release();
  }
  if (artifacts) {
    res.send(artifacts);
  }
};

const byID = async (req, res) => {
  const client = await req.app.get('db').connect();
  let artifact = {};

  try {
    artifact = await getArtifactByID(client, req.params.id);
  } catch (e) {
    serverError(req, res, e);
  } finally {
    client.release();
  }

  if (artifact) {
    res.send(artifact);
  }
};

const update = async (req, res) => {
  // todo security validation
  const client = await req.app.get('db').connect();
  let saved = {};

  try {
    saved = await updateArtifactByID(
      client,
      req.body.id,
      req.body.name,
      req.body.body
    );
  } catch (e) {
    serverError(req, res, e);
  } finally {
    client.release();
  }

  if (saved) {
    res.send(saved);
  }
};

const add = async (req, res) => {
  // todo security validation
  const client = await req.app.get('db').connect();
  let saved = {};

  try {
    const user = await getUserByID(client, req.user.id);
    saved = await createArtifact(client, user.id, req.body.name, req.body.body);
  } catch (e) {
    serverError(req, res, e);
  } finally {
    client.release();
  }

  if (saved) {
    res.send(saved);
  }
};

const addComment = async (req, res) => {
  // todo security validation
  const client = await req.app.get('db').connect();

  try {
    const user = await getUserByID(client, req.user.id);
    const { name: userName } = user.auth_metadata;

    const newComment = await addNewCommentToArtifact(
      client,
      user.id,
      userName,
      req.body.comment,
      req.body.location,
      req.body.id
    );

    res.send(newComment);
  } catch (e) {
    serverError(req, res, e);
  } finally {
    client.release();
  }
};

const updateComment = async (req, res) => {
  // todo security validation
  const client = await req.app.get('db').connect();

  try {
    const user = await getUserByID(client, req.user.id);
    const { name: userName } = user.auth_metadata;

    const newComment = await addNewCommentToArtifact(
      client,
      req.body.commentId,
      userName,
      user.id,
      req.body.comment,
      req.body.id
    );

    res.send(newComment);
  } catch (e) {
    serverError(req, res, e);
  } finally {
    client.release();
  }
};

module.exports = {
  list,
  byID,
  update,
  add,
  addComment,
  updateComment,
};
