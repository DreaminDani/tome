const cookie = require('cookie');
const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event, context) => {
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  })

  const { id, content } = JSON.parse(event.body);
  const { token } = cookie.parse(event.headers.cookie);
  if (token) {
    if (id) {
      // todo update existing document based on id
      return {
        statusCode: 200,
        body: 'blech'
      }
    } else {
      const artifact = await client.query(
        q.Create(
          q.Collection("artifacts"),
          { 
            data: {
              user_id: token,
              content
            },
          }
        )
      )
      return {
        statusCode: 200,
        body: JSON.stringify(artifact)
      }
    }
  } else {
    return {
      statusCode: 403
    }
  }
}