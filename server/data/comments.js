const getCommentsLengthByArtifactID = async (client, id, version) => {
  const getCommentsLength = await client.query(
    `SELECT jsonb_array_length((comments))
      FROM artifacts
      WHERE
          created_at = (
              SELECT
                created_at
              FROM
                (
                    SELECT
                      created_at,
                      ROW_NUMBER () OVER (
                          ORDER BY created_at ASC
                      ) nth
                    FROM
                      (
                          SELECT
                            (created_at)
                          FROM
                            artifacts
                          WHERE artifact_id = $1
                      ) bydate
                ) sorted_bydate
              WHERE
                nth = $2
          );`,
    [id, version]
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
  artifactID,
  artifactVersion
) => {
  const commentsLength = await getCommentsLengthByArtifactID(
    client,
    artifactID,
    artifactVersion
  );

  let insertComment;
  if (commentsLength > 0) {
    insertComment = await client.query(
      /* eslint-disable prettier/prettier */
        `UPDATE artifacts
        SET comments = jsonb_insert(comments, '{${commentsLength + 1}}', ('{"id": "' || gen_random_uuid() || '", "created": ' || extract(epoch from now()) || ', "updated": ' || extract(epoch from now()) || ', "user": {"id": '|| $1 ||', "name": "'|| $2 ||'"}, "comment": '|| $3 ||', "location": '|| $4 ||'}')::jsonb, true)
        WHERE
          created_at = (
              SELECT
                created_at
              FROM
                (
                    SELECT
                      created_at,
                      ROW_NUMBER () OVER (
                          ORDER BY created_at ASC
                      ) nth
                    FROM
                      (
                          SELECT
                            (created_at)
                          FROM
                            artifacts
                          WHERE artifact_id = $5
                      ) bydate
                ) sorted_bydate
              WHERE
                nth = $6
          )
        RETURNING comments as commentlist
`,
        /* eslint-enable prettier/prettier */
      [
        userID,
        userName,
        JSON.stringify(commentBody),
        JSON.stringify(commentLocation),
        artifactID,
        artifactVersion,
      ]
    );
  } else {
    insertComment = await client.query(
      `UPDATE artifacts
        SET comments = ('[{"id": "' || gen_random_uuid() || '", "created": ' || extract(epoch from now()) || ', "updated": ' || extract(epoch from now()) || ', "user": {"id": '|| $1 ||', "name": "'|| $2 ||'"}, "comment": '|| $3 ||', "location": '|| $4 ||'}]')::jsonb
        WHERE
          created_at = (
              SELECT
                created_at
              FROM
                (
                    SELECT
                      created_at,
                      ROW_NUMBER () OVER (
                          ORDER BY created_at ASC
                      ) nth
                    FROM
                      (
                          SELECT
                            (created_at)
                          FROM
                            artifacts
                          WHERE artifact_id = $5
                      ) bydate
                ) sorted_bydate
              WHERE
                nth = $6
          )
        RETURNING comments as commentlist
`,
      [
        userID,
        userName,
        JSON.stringify(commentBody),
        JSON.stringify(commentLocation),
        artifactID,
        artifactVersion,
      ]
    );
  }

  const [newComment] = insertComment.rows;
  return newComment;
};

const updateCommentInArtifact = async (
  client,
  userID,
  userName,
  commentBody,
  commentID,
  artifactID,
  artifactVersion
) => {
  const commentsLength = await getCommentsLengthByArtifactID(
    client,
    artifactID
  );

  const insertComment = await client.query(
    /* eslint-disable prettier/prettier */
    `
    UPDATE artifacts
      SET comments = jsonb_insert(comments, '{${commentsLength + 1}}', ('{"id": "' || $1 || '", "created": ' || extract(epoch from now()) || ', "updated": ' || extract(epoch from now()) || ', "user": {"id": '|| $2 ||', "name": "'|| $3 ||'"}, "comment": '|| $4 ||'}')::jsonb, true)
      WHERE
        created_at = (
            SELECT
              created_at
            FROM
              (
                  SELECT
                    created_at,
                    ROW_NUMBER () OVER (
                        ORDER BY created_at ASC
                    ) nth
                  FROM
                    (
                        SELECT
                          (created_at)
                        FROM
                          artifacts
                        WHERE artifact_id = $5
                    ) bydate
              ) sorted_bydate
            WHERE
              nth = $6
        )
      RETURNING comments as commentlist
`,
    /* eslint-enable prettier/prettier */
    [
      commentID,
      userID,
      userName,
      JSON.stringify(commentBody),
      artifactID,
      artifactVersion,
    ]
  );

  const [newComment] = insertComment.rows;
  return newComment;
};

module.exports = {
  getCommentsLengthByArtifactID,
  addNewCommentToArtifact,
  updateCommentInArtifact,
};
