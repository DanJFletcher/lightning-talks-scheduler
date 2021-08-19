module.exports = {
  validate: async (formData, user, client, query) => {
    let errorBag = {}
    let talks

    console.log(user.user_metadata.fullname, formData.date)

    try {
      talks = await client.query(
        query.Paginate(
          query.Match(query.Index('talks_by_speaker_and_date'), [
            user.user_metadata.full_name,
            formData.date,
          ])
        )
      )
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: error.message }),
      }
    }

    console.log('talks: ', talks, 'date: ', formData.date)

    if (talks.data.length > 0) {
      throw Error(
        JSON.stringify({ other: 'Talk already submitted for this event.' })
      )
    }

    if (!formData.name) {
      errorBag.name = 'Name is required.'
    }

    if (!formData.title) {
      errorBag.title = 'Title is required.'
    }

    if (!formData.time) {
      errorBag.time = 'Length is required.'
    }

    if (Object.keys(errorBag).length > 0) {
      throw Error(JSON.stringify(errorBag))
    }

    return true
  },
}
