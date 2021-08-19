const validation = require('../shared/validation')
describe('create talk validation', () => {
  it.skip('fails if user has a talk that already exists', () => {})

  it('fails if name is not given', () => {
    expect(
      validation.validate({
        date: '08-19-2021',
        name: null,
        title: 'test',
        time: '15',
      })
    ).toEqual({
      name: 'Name is required.',
    })
  })

  it('fails if title is not given', () => {
    expect(
      validation.validate({
        date: '08-19-2021',
        name: 'dude',
        title: null,
        time: '15',
      })
    ).toEqual({
      title: 'Title is required.',
    })
  })

  it('fails if length is not given', () => {
    expect(
      validation.validate({
        date: '08-19-2021',
        name: 'dude',
        title: 'test',
        time: null,
      })
    ).toEqual({
      time: 'Length is required.',
    })
  })
})
