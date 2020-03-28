const { serverError, getEmailFromAuthProvider } = require('../../helpers');
const {
  getArtifactsByUser,
  getArtifactByID,
  newArtifactVersion,
  createArtifact,
} = require('../../data/artifacts');
const { getUserByEmail } = require('../../data/users');
const {
  addNewCommentToArtifact,
  updateCommentInArtifact,
} = require('../../data/comments');

const list = async (req, res) => {
  const client = await req.app.get('db').connect();
  const artifacts = {};

  try {
    const email = getEmailFromAuthProvider(req.user);
    artifacts.list = await getArtifactsByUser(client, email);

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

    if (artifact.length === 1) {
      res.send(artifact[0]);
    } else if (artifact.length > 1) {
      res.send({
        id: req.params.id,
        artifact_data: artifact.map((version, index) => ({
          version: index + 1,
          date: version.date,
          ...version.artifact_data,
        })),
      });
    } else {
      throw new Error(`No artifacts returned for id ${req.params.id}`);
    }
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
    const email = getEmailFromAuthProvider(req.user);
    const user = await getUserByEmail(client, email);

    const saved = await newArtifactVersion(
      client,
      req.body.id,
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

const add = async (req, res) => {
  // todo security validation
  const client = await req.app.get('db').connect();

  try {
    const email = getEmailFromAuthProvider(req.user);
    const user = await getUserByEmail(client, email);
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
    const email = getEmailFromAuthProvider(req.user);
    const user = await getUserByEmail(client, email);
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
    const email = getEmailFromAuthProvider(req.user);
    const user = await getUserByEmail(client, email);
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
