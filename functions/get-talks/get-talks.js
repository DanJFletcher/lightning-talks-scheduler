const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
  keepAlive: false,
})

const handler = async function (event) {
  try {
    const response = await client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection('talks'))),
        q.Lambda((x) => q.Get(x))
      )
    )

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }
  }
}

module.exports = { handler }
