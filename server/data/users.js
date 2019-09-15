const getUserByAuthID = async (client, id) => {
  const getUser = await client.query('SELECT * FROM users WHERE auth_id = $1', [
    id,
  ]);
  const [user] = getUser.rows;
  return user;
};

module.exports = {
  getUserByAuthID,
};
