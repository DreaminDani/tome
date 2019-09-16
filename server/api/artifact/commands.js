const { serverError } = require('../../helpers');
const {
  getArtifactsByUser,
  getArtifactByID,
  updateArtifactByID,
  createArtifact,
} = require('../../data/artifacts');
const { getUserByAuthID } = require('../../data/users');
const {
  addNewCommentToArtifact,
  updateCommentInArtifact,
} = require('../../data/comments');

const list = async (req, res) => {
  const client = await req.app.get('db').connect();
  const artifacts = {};

  try {
    artifacts.list = await getArtifactsByUser(client, req.user.id);

    res.send(artifacts);
  } catch (e) {
    serverError(req, res, e);
  } finally {
    client.release();
  }
};

const byID = async (req, res) => {
  const client = await req.app.get('db').connect();

  try {
    const artifact = await getArtifactByID(client, req.params.id);

    res.send(artifact);
  } catch (e) {
    serverError(req, res, e);
  } finally {
    client.release();
  }
};

const update = async (req, res) => {
  // todo security validation
  const client = await req.app.get('db').connect();

  try {
    const saved = await updateArtifactByID(
      client,
      req.body.id,
      req.body.name,
      req.body.body
    );

    res.send(saved);
  } catch (e) {
    serverError(req, res, e);
  } finally {
    client.release();
  }
};

const add = async (req, res) => {
  // todo security validation
  const client = await req.app.get('db').connect();

  try {
    const user = await getUserByAuthID(client, req.user.id);
    const saved = await createArtifact(
      client,
      user.id,
      req.body.name,
      req.body.body
    );

    res.send(saved);
  } catch (e) {
    serverError(req, res, e);
  } finally {
    client.release();
  }
};

const addComment = async (req, res) => {
  // todo security validation
  const client = await req.app.get('db').connect();

  try {
    const user = await getUserByAuthID(client, req.user.id);
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
    const user = await getUserByAuthID(client, req.user.id);
    const { name: userName } = user.auth_metadata;

    const newComment = await updateCommentInArtifact(
      client,
      user.id,
      userName,
      req.body.comment,
      req.body.commentID,
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
