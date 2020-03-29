const getUserByEmail = async (client, email) => {
  const getUser = await client.query('SELECT * FROM users WHERE email = $1', [
    email,
  ]);
  const [user] = getUser.rows;
  return user;
};

const verifyUser = async (client, email, password, cb) => {
  client.query(
    `SELECT * FROM users
    WHERE email = $1
    AND password= crypt($2, password)`,
    [email, password],
    function (err, getUser) {
      if (err) {
        client.release();
        return cb(err);
      }

      if (getUser.rows[0]) {
        client.release();
        return cb(null, getUser.rows[0].auth_metadata);
      }

      client.release();
      return cb(null, false);
    }
  );
};

const addUser = async (client, email, password, firstName, lastName) => {
  const auth_metadata = {
    sub: 'local',
    name: `${firstName} ${lastName}`,
    email,
    locale: 'en', // todo detect this from browser
    given_name: firstName,
    family_name: lastName,
    email_verified: false, // todo add email verification
  };
  const addedUser = await client.query(
    `INSERT INTO users (email, auth_metadata, password) VALUES (
    $1,
    $2,
    crypt($3, gen_salt('bf'))
  );`,
    [email, auth_metadata, password]
  );
  const [user] = addedUser.rows;
  return user;
};

module.exports = {
  getUserByEmail,
  addUser,
  verifyUser,
};
