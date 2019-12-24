const express = require('express');

const router = express.Router();
const { getUserByEmail, addUser } = require('./data/users');

const testUser = {
  email: 'Joe@example.com',
  password: 'Test123!',
  firstName: 'Joe',
  lastName: 'Example',
};

router.get('/db/reset', async (req, res) => {
  const client = await req.app.get('db').connect();
  try {
    await client.query('TRUNCATE artifacts, session, users');
    res.send(200);
  } catch {
    res.send(500);
  }
});

router.get('/db/seed-user', async (req, res) => {
  const client = await req.app.get('db').connect();
  try {
    const user = await getUserByEmail(client, testUser.email);
    if (!user) {
      await addUser(
        client,
        testUser.email,
        testUser.password,
        testUser.firstName,
        testUser.lastName
      );
    }

    res.status(200);
    res.json(testUser);
  } catch {
    res.send(500);
  }
});

module.exports = router;
