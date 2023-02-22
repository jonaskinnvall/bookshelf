import React from 'react'

const AuthContext = React.createContext()

function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider!')
  }
  return context
}

export {AuthContext, useAuth}
