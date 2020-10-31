const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event, context) => {
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  })

  const { email, password } = JSON.parse(event.body);

  try {
    const authedUser = await client.query(
      q.Login(
        q.Match(q.Index("users_by_email"), email),
        { password },
      )
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        token: authedUser.secret
      })
    }
  } catch (e) {
    if (e.requestResult && e.requestResult.statusCode === 400) {
      return {
        statusCode: 400,
        body: "Invalid email or password"
      }
    }

    console.error({...e, code: "1001"});
    return {
      statusCode: 500,
      body: "Internal Server Error 1001"
    }
  }
}