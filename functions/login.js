const utils = require('./utils')
const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event, context) => {
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  })

  return utils.validateAuth(event.body, async (email, password) => {
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
        try {
          const user = await client.query(q.Get(q.Match(q.Index("users_by_email"), email)));
          if (user) {
            return {
              statusCode: 400,
              body: "Invalid email or password"
            }
          }

          console.error({ message: "unexpected code reached", code: "0002"});
          return {
            statusCode: 500,
            body: "Internal Server Error 0002"
          }
        } catch (e) {
          return {
            statusCode: 400,
            body: "There is no account with that email address"
          }
        }
      }

      console.error({...e, code: "1001"});
      return {
        statusCode: 500,
        body: "Internal Server Error 1001"
      }
    }
  });
}