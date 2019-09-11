const getArtifactsByUser = async (client, userID) => {
  const getArtifacts = await client.query(
    `
    SELECT a.id, jsonb_extract_path(a.artifact_data,'name') as name,
      a.user_id, a.created_at, a.updated_at, u.auth_metadata
    FROM artifacts a, users u
    WHERE a.user_id=u.id and auth_id = $1
  `,
    [userID]
  );
  return getArtifacts.rows; // currently just gets all that user owns
};

const getArtifactByID = async (client, id) => {
  const getArtifact = await client.query(
    'SELECT * FROM artifacts WHERE id = $1',
    [id]
  );
  const [artifact] = getArtifact.rows;
  return artifact;
};

const updateArtifactByID = async (client, id, name, body) => {
  const updateArtifact = await client.query(
    `
          UPDATE artifacts
          SET artifact_data = $1
          WHERE
            id = $2
          RETURNING id;
        `,
    [{ name, body }, id]
  );
  const [saved] = updateArtifact.rows;
  return saved;
};

const createArtifact = async (client, userID, name, body) => {
  const insertArtifact = await client.query(
    `
          INSERT INTO artifacts(user_id, artifact_data)
          VALUES($1, $2) RETURNING id;
        `,
    [userID, { name, body }]
  );
  const [saved] = insertArtifact.rows;
  return saved;
};

module.exports = {
  getArtifactsByUser,
  getArtifactByID,
  updateArtifactByID,
  createArtifact,
};
