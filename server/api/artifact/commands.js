const { serverError, getEmailFromAuthProvider } = require('../../helpers');
const {
  getArtifactsByUser,
  getArtifactByID,
  updateArtifactByID,
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
    const currentArtifact = await getArtifactByID(client, req.body.id);
    const { artifact_data } = currentArtifact;
    const newVersion = {
      body: req.body.body,
      name: req.body.name,
      date: new Date().toISOString(),
    };

    let artifactData;
    if (Array.isArray(artifact_data)) {
      newVersion.version = artifact_data.length + 1;
      artifactData = artifact_data.push(newVersion);
    } else {
      newVersion.version = 2;
      artifactData = [
        {
          version: 1,
          ...artifact_data,
          date: new Date(currentArtifact.updated_at),
        },
        newVersion,
      ];
    }

    const saved = await updateArtifactByID(
      client,
      req.body.id,
      req.body.name,
      artifactData
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
