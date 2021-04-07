import { cloneDeep } from 'lodash'
import { PartialDeep } from 'type-fest'
import netlifyIdentity from 'netlify-identity-widget'

export const userFactory = (attrs: PartialDeep<netlifyIdentity.User>) => {
  return cloneDeep({
    api: {
      apiURL: 'fake',
      defaultHeaders: {},
    },
    app_metadata: {
      provider: 'fake',
      roles: [],
    },
    aud: 'fake',
    confirmed_at: 'fake',
    created_at: 'fake',
    updated_at: 'fake',
    invited_at: 'fake',
    recovery_sent_at: 'fake',
    email: 'fake',
    id: 'fake',
    role: 'fake',
    url: 'fake',
    user_metadata: {
      avatar_url: 'fake',
      full_name: 'fake',
    },
    ...attrs,
  })
}
