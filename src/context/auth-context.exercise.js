import React from 'react'
import * as auth from 'auth-provider'
import {useAsync} from 'utils/hooks'
import {client} from 'utils/api-client'
import {FullPageSpinner, FullPageErrorFallback} from 'components/lib'

async function getUser() {
  let user = null

  const token = await auth.getToken()
  if (token) {
    const data = await client('me', {token})
    user = data.user
  }

  return user
}

const AuthContext = React.createContext()
AuthContext.displayName = 'AuthContext'

function AuthProvider(props) {
  const {
    data: user,
    run,
    error,
    isError,
    isLoading,
    isSuccess,
    isIdle,
    setData,
  } = useAsync()

  React.useEffect(() => {
    run(getUser())
  }, [run])

  const login = form => auth.login(form).then(user => setData(user))
  const register = form => auth.register(form).then(user => setData(user))
  const logout = () => {
    auth.logout()
    setData(null)
  }

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />
  }

  const value = {user, login, register, logout}

  if (isSuccess) {
    return <AuthContext.Provider value={value} {...props} />
  }
}

function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider!')
  }
  return context
}

export {AuthProvider, useAuth}
