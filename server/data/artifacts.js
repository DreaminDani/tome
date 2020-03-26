const getArtifactsByUser = async (client, email) => {
  const getArtifacts = await client.query(
    `
    SELECT a.artifact_id as id, a.name,
      a.user_id, a.created_at, a.updated_at, u.auth_metadata
    FROM artifacts a, users u
    WHERE a.user_id=u.id and email = $1
  `,
    [email]
  );
  return getArtifacts.rows; // currently just gets all that user owns
};

const getArtifactByID = async (client, id) => {
  const getArtifact = await client.query(
    'SELECT artifact_id as id, artifact_data FROM artifacts WHERE artifact_id = $1',
    [id]
  );
  const [artifact] = getArtifact.rows;
  return artifact;
};

const updateArtifactByID = async (client, id, name, artifact_data) => {
  const updateArtifact = await client.query(
    `
          UPDATE artifacts
          SET
            name = $1,
            artifact_data = $2
          WHERE
            id = $3
          RETURNING artifact_id as id;
        `,
    [name, JSON.stringify(artifact_data), id]
  );
  const [saved] = updateArtifact.rows;
  return saved;
};

const newArtifactVersion = async (client, artifactID, userID, name, body) => {
  const insertArtifact = await client.query(
    `
          INSERT INTO artifacts(artifact_id, user_id, name, artifact_data)
          VALUES($1, $2, $3, $4) RETURNING artifact_id as id;
        `,
    [artifactID, userID, name, { name, body }]
  );
  const [saved] = insertArtifact.rows;
  return saved;
};

const createArtifact = async (client, userID, name, body) => {
  const insertArtifact = await client.query(
    `
          INSERT INTO artifacts(user_id, name, artifact_data)
          VALUES($1, $2, $3) RETURNING artifact_id as id;
        `,
    [userID, name, { name, body }]
  );
  const [saved] = insertArtifact.rows;
  return saved;
};

module.exports = {
  getArtifactsByUser,
  getArtifactByID,
  updateArtifactByID,
  newArtifactVersion,
  createArtifact,
};
