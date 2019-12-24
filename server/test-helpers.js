const express = require('express');

const router = express.Router();

router.get('/db/reset', async (req, res) => {
  const client = await req.app.get('db').connect();
  try {
    await client.query('TRUNCATE artifacts, session, users');
    res.send(200);
  } catch {
    res.send(500);
  }
});

module.exports = router;
