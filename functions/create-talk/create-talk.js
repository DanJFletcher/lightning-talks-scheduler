const fetch = require('node-fetch')
const faunadb = require('faunadb')
const query = faunadb.query
const client = new faunadb.Client({secret: process.env.FAUNA_DB_SECRET, keepAlive: false})

const handler = async function (event) {
  const {user, formData} = JSON.parse(event.body)
  try {
    const response = await client.query(
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
    // if (!response.ok) {
    //   // NOT res.status >= 200 && res.status < 300
    //   return { statusCode: response.status, body: response.statusText }
    // }

    return {
      statusCode: 204,
    }
  } catch (error) {
    // output to netlify function log
    console.log(error)
    return {
      statusCode: 500,
      // Could be a custom message or object i.e. JSON.stringify(err)
      body: JSON.stringify({ message: error.message }),
    }
  }
}

module.exports = { handler }
