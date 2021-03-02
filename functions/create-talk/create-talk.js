const faunadb = require('faunadb')
const query = faunadb.query
const client = new faunadb.Client({secret: process.env.FAUNA_DB_SECRET, keepAlive: false})

const handler = async function (event) {
  const {user, formData} = JSON.parse(event.body)
  try {
    await client.query(
      query.Create(
        query.Collection('talks'),
        { data: {
          email: user.email,
          speaker: formData.speaker,
          title: formData.title,
          date: formData.date,
          length: formData['length']
        }}
      )
    )

    return {
      statusCode: 204,
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }
  }
}

module.exports = { handler }
