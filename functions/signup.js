const utils = require('./utils');
const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event, context) => {
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  })

  return utils.validateAuth(event.body, async (email, password) => {
    try {
      const user = await client.query(q.Get(q.Match(q.Index("users_by_email"), email)));
      if (user) {
        return {
          statusCode: 400,
          body: "Email already in use"
        }
      }

      console.error({ message: "unexpected code reached", code: "0002"});
      return {
        statusCode: 500,
        body: "Internal Server Error 0002"
      }
    } catch (e) {
      if (e.requestResult && e.requestResult.statusCode === 404) {
        // if not, create user
        try {
          const user = await client.query(
            q.Create(
              q.Collection("users"),
              {
                credentials: { password },
                data: { email },
              }
            )
          )
          // then login as user
          const authedUser = await client.query(
            q.Login(
              q.Match(q.Index("users_by_email"), email),
              { password },
            )
          )

          return {
            statusCode: 200,
            body: JSON.stringify({
              token: authedUser.secret
            })
          }
        } catch (error) {
          console.error({...error, code: "0004"});
          return {
            statusCode: 500,
            body: "Internal Server Error 0004"
          }
        }
      }

      console.error({ message: "unexpected code reached", code: "0003"});
      return {
        statusCode: 500,
        body: "Internal Server Error 0003"
      }
    }
  })
}