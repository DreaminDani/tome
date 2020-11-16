const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event, context) => {
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  })

  const { id, content } = event.body;
  // get user id from headers
  // save new record (need to create a new table in fauna)
  // todo update existing document based on id

}