const getUserByEmail = async (client, id) => {
  // todo update this to be email only
  const getUser = await client.query('SELECT * FROM users WHERE email = $1', [
    id,
  ]);
  const [user] = getUser.rows;
  return user;
};

module.exports = {
  getUserByEmail,
};
