const emailValidator = require("email-validator");
const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event, context) => {
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  })

  // todo change these into a FP-style chain
  const { email, password } = JSON.parse(event.body);
  if (email && password) {
    if (password.length > 100) {
      return {
        statusCode: 400,
        body: "Password may be no longer than 100 characters"
      }
    }

    if (emailValidator.validate(email)) {
      // check if user exists
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
    } else {
      return {
        statusCode: 400,
        body: "Email is invalid"
      }
    }
  } else if (email) {
    return {
      statusCode: 400,
      body: "Password is required"
    }
  } else if (password) {
    return {
      statusCode: 400,
      body: "Email is required"
    }
  } else {
    return {
      statusCode: 400,
      body: "Email and password are required"
    }
  }
}