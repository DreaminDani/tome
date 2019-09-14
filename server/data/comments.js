const getCommentsLengthByArtifactID = async (client, id) => {
  const getCommentsLength = await client.query(
    `SELECT jsonb_array_length((artifact_data->'comments'))
    FROM artifacts WHERE id = $1;`,
    [id]
  );

  return getCommentsLength.rows[0]
    ? getCommentsLength.rows[0].jsonb_array_length
    : 0;
};

const addNewCommentToArtifact = async (
  client,
  userID,
  userName,
  commentBody,
  commentLocation,
  artifactID
) => {
  const commentsLength = await getCommentsLengthByArtifactID(
    client,
    artifactID
  );

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
        userID,
        userName,
        JSON.stringify(commentBody),
        JSON.stringify(commentLocation),
        artifactID,
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
        userID,
        userName,
        JSON.stringify(commentBody),
        JSON.stringify(commentLocation),
        artifactID,
      ]
    );
  }

  const [newComment] = insertComment.rows;
  return newComment;
};

const updateCommentInArtifact = async (
  client,
  commentID,
  userID,
  userName,
  commentBody,
  artifactID
) => {
  const commentsLength = await getCommentsLengthByArtifactID(
    client,
    artifactID
  );

  const insertComment = await client.query(
    /* eslint-disable prettier/prettier */
    `
    UPDATE artifacts
      SET artifact_data = jsonb_insert(artifact_data, '{comments,${commentsLength + 1}}', ('{"id": "' || $1 || '", "created": ' || extract(epoch from now()) || ', "updated": ' || extract(epoch from now()) || ', "user": {"id": '|| $2 ||', "name": "'|| $3 ||'"}, "comment": '|| $4 ||'}')::jsonb, true)
      WHERE id = $5
      RETURNING artifact_data->'comments' as commentlist
`,
    /* eslint-enable prettier/prettier */
    [commentID, userID, userName, JSON.stringify(commentBody), artifactID]
  );

  const [newComment] = insertComment.rows;
  return newComment;
};

module.exports = {
  getCommentsLengthByArtifactID,
  addNewCommentToArtifact,
  updateCommentInArtifact,
};
