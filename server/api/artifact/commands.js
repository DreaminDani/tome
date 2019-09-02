const { serverError } = require('../../helpers');

const list = async (req, res) => {
  const client = await req.app.get('db').connect();
  const artifacts = {};

  try {
    const getArtifacts = await client.query(
      `
      SELECT a.id, jsonb_extract_path(a.artifact_data,'name') as name,
        a.user_id, a.created_at, a.updated_at, u.auth_metadata
      FROM artifacts a, users u
      WHERE a.user_id=u.id and auth_id = $1
    `,
      [req.user.id]
    );
    artifacts.list = getArtifacts.rows; // currently just gets all that user owns
  } catch (e) {
    serverError(req, res, e);
  } finally {
    client.release();
  }

  res.send(artifacts);
};

const byID = async (req, res) => {
  const client = await req.app.get('db').connect();
  let artifact = {};

  try {
    const getArtifact = await client.query(
      'SELECT * FROM artifacts WHERE id = $1',
      [req.params.id]
    );
    [artifact] = getArtifact.rows;
  } catch (e) {
    serverError(req, res, e);
  } finally {
    client.release();
  }

  res.send(artifact);
};

const update = async (req, res) => {
  // todo security validation
  const client = await req.app.get('db').connect();
  let saved = {};

  try {
    const updateArtifact = await client.query(
      `
            UPDATE artifacts
            SET artifact_data = $1
            WHERE
              id = $2
            RETURNING id;
          `,
      [
        {
          name: req.body.name,
          body: req.body.body,
        },
        req.body.id,
      ]
    );
    [saved] = updateArtifact.rows;
  } catch (e) {
    serverError(req, res, e);
  } finally {
    client.release();
  }

  res.send(saved);
};

const add = async (req, res) => {
  // todo security validation
  const client = await req.app.get('db').connect();
  let saved = {};

  try {
    const getUser = await client.query(
      'SELECT * FROM users WHERE auth_id = $1',
      [req.user.id]
    );
    const insertArtifact = await client.query(
      `
            INSERT INTO artifacts(user_id, artifact_data)
            VALUES($1, $2) RETURNING id;
          `,
      [getUser.rows[0].id, req.body]
    );
    [saved] = insertArtifact.rows;
  } catch (e) {
    serverError(req, res, e);
  } finally {
    client.release();
  }

  res.send(saved);
};

const addComment = async (req, res) => {
  // todo security validation
  const client = await req.app.get('db').connect();

  try {
    const getUser = await client.query(
      'SELECT * FROM users WHERE auth_id = $1',
      [req.user.id]
    );
    const { name } = getUser.rows[0].auth_metadata;

    const getCommentsLength = await client.query(
      `SELECT jsonb_array_length((artifact_data->'comments'))
      FROM artifacts WHERE id = $1;`,
      [req.body.id]
    );
    const commentsLength = getCommentsLength.rows[0]
      ? getCommentsLength.rows[0].jsonb_array_length
      : 0;

    let insertComment;
    if (commentsLength > 0) {
      insertComment = await client.query(
        /* eslint-disable prettier/prettier */
        `UPDATE artifacts
        SET artifact_data = jsonb_insert(artifact_data, '{comments,${commentsLength + 1}}', ('{"id": "' || gen_random_uuid() || '", "created": ' || extract(epoch from now()) || ', "updated": ' || extract(epoch from now()) || ', "user": {"id": '|| $1 ||', "name": "'|| $2 ||'"}, "comment": '|| $3 ||', "location": '|| $4 ||'}')::jsonb, true)
        WHERE id = $5
        RETURNING artifact_data->'comments' as commentlist
`,
      /* eslint-enable prettier/prettier */
        [
          getUser.rows[0].id,
          name,
          JSON.stringify(req.body.comment),
          JSON.stringify(req.body.location),
          req.body.id,
        ]
      );
    } else {
      insertComment = await client.query(
        `UPDATE artifacts
        SET artifact_data = jsonb_set(artifact_data, '{comments}', ('[{"id": "' || gen_random_uuid() || '", "created": ' || extract(epoch from now()) || ', "updated": ' || extract(epoch from now()) || ', "user": {"id": '|| $1 ||', "name": "'|| $2 ||'"}, "comment": '|| $3 ||', "location": '|| $4 ||'}]')::jsonb, true)
        WHERE id = $5
        RETURNING artifact_data->'comments' as commentlist
`,
        [
          getUser.rows[0].id,
          name,
          JSON.stringify(req.body.comment),
          JSON.stringify(req.body.location),
          req.body.id,
        ]
      );
    }

    res.send(insertComment.rows[0]);
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
    const getUser = await client.query(
      'SELECT * FROM users WHERE auth_id = $1',
      [req.user.id]
    );
    const { name } = getUser.rows[0].auth_metadata;

    const getCommentsLength = await client.query(
      `SELECT jsonb_array_length((artifact_data->'comments'))
      FROM artifacts WHERE id = $1;`,
      [req.body.id]
    );
    const commentsLength = getCommentsLength.rows[0]
      ? getCommentsLength.rows[0].jsonb_array_length
      : 0;

    const insertComment = await client.query(
      /* eslint-disable prettier/prettier */
      `
      UPDATE artifacts
        SET artifact_data = jsonb_insert(artifact_data, '{comments,${commentsLength + 1}}', ('{"id": "' || $1 || '", "created": ' || extract(epoch from now()) || ', "updated": ' || extract(epoch from now()) || ', "user": {"id": '|| $2 ||', "name": "'|| $3 ||'"}, "comment": '|| $4 ||'}')::jsonb, true)
        WHERE id = $5
        RETURNING artifact_data->'comments' as commentlist
`,
      /* eslint-enable prettier/prettier */
      [
        req.body.commentId,
        getUser.rows[0].id,
        name,
        JSON.stringify(req.body.comment),
        req.body.id,
      ]
    );

    res.send(insertComment.rows[0]);
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
