/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import * as auth from 'auth-provider'
import * as colors from 'styles/colors'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'
import {client} from 'utils/api-client.exercise'
import {useAsync} from 'utils/hooks'
import {FullPageSpinner} from 'components/lib'

async function fetchUser() {
  let user = null

  const token = await auth.getToken()
  if (token) {
    const data = await client('me', {token})
    user = data.user
  }
  return user
}

function App() {
  const {
    data: user,
    error,
    isIdle,
    isLoading,
    isSuccess,
    isError,
    run,
    setData: setUser,
  } = useAsync()

  React.useEffect(() => {
    run(fetchUser())
  }, [run])

  const login = form => auth.login(form).then(u => setUser(u))

  const register = form => auth.register(form).then(u => setUser(u))

  const logout = () => {
    auth.logout()
    setUser(null)
  }

  if (isIdle || isLoading) {
    return <FullPageSpinner />
  } else if (isError) {
    ;<div
      css={{
        color: colors.danger,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <p>Uh oh... There's a problem. Try refreshing the app.</p>
      <pre>{error.message}</pre>
    </div>
  } else if (isSuccess) {
    return user ? (
      <AuthenticatedApp user={user} logout={logout} />
    ) : (
      <UnauthenticatedApp login={login} register={register} />
    )
  }
}

export {App}
