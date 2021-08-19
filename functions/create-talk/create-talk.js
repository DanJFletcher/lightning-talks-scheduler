const faunadb = require('faunadb')
const query = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
  keepAlive: false,
})
const validation = require('../shared/validation.js')

const handler = async function (event) {
  const { user, formData } = JSON.parse(event.body)
  try {
    await validation.validate(formData, user, client, query)
  } catch (error) {
    return {
      statusCode: 422,
      body: JSON.stringify({ errors: JSON.parse(error.message) }),
    }
  }

  try {
    await client.query(
      query.Create(query.Collection('talks'), {
        data: {
          email: user.email,
          speaker: user.user_metadata.full_name,
          title: formData.title,
          date: formData.date,
          time: formData.time,
        },
      })
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
