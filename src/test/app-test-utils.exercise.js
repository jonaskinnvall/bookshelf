import {
  render as rtlRender,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as auth from 'auth-provider'
import * as usersDB from 'test/data/users'
import {buildUser} from 'test/generate'
import {AppProviders} from 'context'

const render = async (ui, {route = '/list', user, ...renderOptions} = {}) => {
  user = typeof user === 'undefined' ? await loginAsUser() : user
  window.history.pushState({}, 'page title', route)

  const returnValue = {
    ...rtlRender(ui, {wrapper: AppProviders, ...renderOptions}),
    user,
  }

  await waitForLoadingToFinish()

  return returnValue
}

const loginAsUser = async userProperties => {
  const user = buildUser(userProperties)
  await usersDB.create(user)
  const authUser = await usersDB.authenticate(user)
  window.localStorage.setItem(auth.localStorageKey, authUser.token)
  return authUser
}

const waitForLoadingToFinish = () =>
  waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ])

export * from '@testing-library/react'
export {render, userEvent, loginAsUser, waitForLoadingToFinish}
