import {server, rest} from 'test/server'
import {client} from '../api-client'
import {queryCache} from 'react-query'
import * as auth from 'auth-provider'

const apiURL = process.env.REACT_APP_API_URL

jest.mock('react-query')
jest.mock('auth-provider')

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('calls fetch at the endpoint with the arguments for GET requests', async () => {
  const endpoint = 'test-endpoint'
  const mockResult = {mockValue: 'VALUE'}
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.json(mockResult))
    }),
  )

  const result = await client(endpoint)

  expect(result).toEqual(mockResult)
})

test('adds auth token when a token is provided', async () => {
  const token = 'jonki_bonki_123'
  let request
  const endpoint = 'test-endpoint'
  const mockResult = {mockValue: 'VALUE'}

  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json(mockResult))
    }),
  )

  await client(endpoint, {token})

  expect(request.headers.get('Authorization')).toBe(`Bearer ${token}`)
})

test('allows for config overrides', async () => {
  let request
  const endpoint = 'test-endpoint'
  const mockResult = {mockValue: 'VALUE'}

  server.use(
    rest.put(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req
      return res(ctx.json(mockResult))
    }),
  )

  const customConfig = {method: 'PUT', headers: {'Content-Type': 'fake-type'}}
  await client(endpoint, customConfig)

  expect(request.headers.get('Content-Type')).toBe(
    customConfig.headers['Content-Type'],
  )
})

test('when data is provided, it is stringified and the method defaults to POST', async () => {
  const endpoint = 'test-endpoint'
  server.use(
    rest.post(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.json(req.body))
    }),
  )

  const data = {username: 'jonki', book: 'It'}
  const result = await client(endpoint, {data})

  expect(result).toEqual(data)
})

test('when response.ok is false, promise rejects with data returned from server', async () => {
  const endpoint = 'test-endpoint'
  const testError = {message: 'Test error'}
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.status(400), ctx.json(testError))
    }),
  )

  await expect(client(endpoint)).rejects.toEqual(testError)
})

test('when status is 401 we log user out and clear the query cache', async () => {
  const endpoint = 'test-endpoint'
  const mockResult = {mockValue: 'VALUE'}
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.status(401), ctx.json(mockResult))
    }),
  )

  const error = await client(endpoint).catch(e => e)

  expect(error.message).toMatchInlineSnapshot(`"Please re-authenticate."`)
  expect(queryCache.clear).toHaveBeenCalledTimes(1)
  expect(auth.logout).toHaveBeenCalledTimes(1)
})
