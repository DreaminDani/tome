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
  let commentList = {};

  try {
    const getUser = await client.query(
      'SELECT * FROM users WHERE auth_id = $1',
      [req.user.id]
    );
    const getCommentsLength = await client.query(
      `select jsonb_array_length((artifact_data->'comments'))
      from artifacts where id = '$1';`,
      [req.params.id]
    );
    const [commentsLength] = getCommentsLength.rows;

    let insertComment;
    if (commentsLength > 0) {
      insertComment = await client.query(
        `UPDATE artifacts
        SET artifact_data = jsonb_insert(artifact_data, '{comments,$1}, ('[{"id": "' || gen_random_uuid() || '", "user": {id: $2, name: $3}, "comment": $4 }]')::jsonb, true)
        WHERE id = $4
        RETURNING artifact_data->'comments'
`,
        [
          commentsLength,
          getUser.rows[0].id,
          getUser.rows[0].name,
          req.params.comment,
          req.params.id,
        ]
      );
    } else {
      insertComment = await client.query(
        `UPDATE artifacts
        SET artifact_data = jsonb_set(artifact_data, '{comments}', ('[{"id": "' || gen_random_uuid() || '", "user": {id: $1, name: $2}, "comment": $3 }]')::jsonb, true)
        WHERE id = $4
        RETURNING artifact_data->'comments'
`,
        [
          getUser.rows[0].id,
          getUser.rows[0].name,
          req.params.comment,
          req.params.id,
        ]
      );
    }

    [commentList] = insertComment.rows;
  } catch (e) {
    serverError(req, res, e);
  } finally {
    client.release();
  }

  res.send(commentList);
};

module.exports = {
  list,
  byID,
  update,
  add,
  addComment,
};
