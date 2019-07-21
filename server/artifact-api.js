const bodyParser = require("body-parser");
const express = require("express");
const { ensureAuthenticated } = require("./helpers");

const router = express.Router();

router.use(bodyParser.json());

const thoughts = [
  { _id: 123, message: "I love pepperoni pizza!", author: "unknown" },
  { _id: 456, message: "I'm watching Netflix.", author: "unknown" }
];

// todo ids of artifacts for user:
//  1. list of artifacts I own
//  2. list of artifacts shared with me
router.get("/api/artifact", ensureAuthenticated, (req, res) => {
  const orderedThoughts = thoughts.sort((t1, t2) => t2._id - t1._id);
  res.send(orderedThoughts);
});

// get artifact by id
router.get("/api/artifact/:id", ensureAuthenticated, async (req, res) => {
  const client = await req.app.get("db").connect();
  let artifact = {};

  try {
    const getArtifact = await client.query('SELECT * FROM artifacts WHERE id = $1', [req.params.id]);
    artifact = getArtifact.rows[0];
  } finally {
    client.release();
  }

  res.send(artifact);
});

router.post("/api/artifact/add", ensureAuthenticated, async (req, res) => {
  // todo security validation
  const client = await req.app.get("db").connect();
  let saved = {};

  try {
    const getUser = await client.query('SELECT * FROM users WHERE auth_id = $1', [req.user.id]);
    const response = await client.query(`
            INSERT INTO artifacts(user_id, artifact_data)
            VALUES($1, $2) RETURNING id;
          `, [getUser.rows[0].id, req.body]);
    saved = response.rows[0];
  } finally {
    client.release();
  }

  res.send(saved);
});

module.exports = router;