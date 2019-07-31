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
  } finally {
    client.release();
  }

  res.send(saved);
};

module.exports = {
  list,
  byID,
  update,
  add,
};
