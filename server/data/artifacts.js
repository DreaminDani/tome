const getArtifactsByUser = async (client, email) => {
  const getArtifacts = await client.query(
    `
    SELECT DISTINCT ON (a.artifact_id)
    a.artifact_id as id, a.name,
          a.user_id, a.created_at, a.updated_at, u.auth_metadata
    FROM artifacts a, users u
    WHERE a.user_id=u.id and email = $1
    ORDER BY a.artifact_id, a.created_at DESC;
  `,
    [email]
  );
  return getArtifacts.rows; // currently just gets all that user owns
};

const getArtifactByID = async (client, id) => {
  const getArtifact = await client.query(
    `SELECT
        artifact_id as id,
        created_at as date,
        json_build_object('name', name, 'body', body, 'comments', comments) as artifact_data
      FROM artifacts
      WHERE artifact_id = $1`,
    [id]
  );
  const artifact = getArtifact.rows;
  return artifact;
};

const newArtifactVersion = async (client, artifactID, userID, name, body) => {
  const insertArtifact = await client.query(
    `
          INSERT INTO artifacts(artifact_id, user_id, name, body)
          VALUES($1, $2, $3, $4) RETURNING artifact_id as id;
        `,
    [artifactID, userID, name, body]
  );
  const [saved] = insertArtifact.rows;
  return saved;
};

const createArtifact = async (client, userID, name, body) => {
  const insertArtifact = await client.query(
    `
          INSERT INTO artifacts(user_id, name, body)
          VALUES($1, $2, $3) RETURNING artifact_id as id;
        `,
    [userID, name, body]
  );
  const [saved] = insertArtifact.rows;
  return saved;
};

module.exports = {
  getArtifactsByUser,
  getArtifactByID,
  newArtifactVersion,
  createArtifact,
};
