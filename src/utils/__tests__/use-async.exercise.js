import {renderHook, act} from '@testing-library/react'
import {useAsync} from '../hooks'

beforeEach(() => {
  jest.spyOn(console, 'error')
})

afterEach(() => {
  console.error.mockRestore()
})

function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {promise, resolve, reject}
}

test('calling run with a promise which resolves', async () => {
  const {promise, resolve} = deferred()
  const {result} = renderHook(() => useAsync())
  expect(result.current).toEqual({
    status: 'idle',
    data: null,
    error: null,
    isError: false,
    isIdle: true,
    isLoading: false,
    isSuccess: false,
    reset: expect.any(Function),
    run: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
  })

  let p
  act(() => {
    p = result.current.run(promise)
  })

  expect(result.current).toEqual({
    status: 'pending',
    data: null,
    error: null,
    isError: false,
    isIdle: false,
    isLoading: true,
    isSuccess: false,
    reset: expect.any(Function),
    run: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
  })

  const resolvedValue = Symbol('resolved value')
  await act(async () => {
    resolve(resolvedValue)
    await p
  })

  expect(result.current).toEqual({
    status: 'resolved',
    data: resolvedValue,
    error: null,
    isError: false,
    isIdle: false,
    isLoading: false,
    isSuccess: true,
    reset: expect.any(Function),
    run: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
  })

  act(() => {
    result.current.reset()
  })

  expect(result.current).toEqual({
    status: 'idle',
    data: null,
    error: null,
    isError: false,
    isIdle: true,
    isLoading: false,
    isSuccess: false,
    reset: expect.any(Function),
    run: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
  })
})

test('calling run with a promise which rejects', async () => {
  const {promise, reject} = deferred()
  const {result} = renderHook(() => useAsync())
  expect(result.current).toEqual({
    status: 'idle',
    data: null,
    error: null,
    isError: false,
    isIdle: true,
    isLoading: false,
    isSuccess: false,
    reset: expect.any(Function),
    run: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
  })

  let p
  act(() => {
    p = result.current.run(promise)
  })

  expect(result.current).toEqual({
    status: 'pending',
    data: null,
    error: null,
    isError: false,
    isIdle: false,
    isLoading: true,
    isSuccess: false,
    reset: expect.any(Function),
    run: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
  })

  const rejectedValue = Symbol('rejected value')
  await act(async () => {
    reject(rejectedValue)
    await p.catch(() => {
      // ignore error
    })
  })

  expect(result.current).toEqual({
    status: 'rejected',
    data: null,
    error: rejectedValue,
    isError: true,
    isIdle: false,
    isLoading: false,
    isSuccess: false,
    reset: expect.any(Function),
    run: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
  })

  act(() => {
    result.current.reset()
  })

  expect(result.current).toEqual({
    status: 'idle',
    data: null,
    error: null,
    isError: false,
    isIdle: true,
    isLoading: false,
    isSuccess: false,
    reset: expect.any(Function),
    run: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
  })
})

test('can specify an initial state', async () => {
  const mockData = Symbol('resolved value')
  const customInitialState = {
    status: 'resolved',
    data: mockData,
  }
  const {result} = renderHook(() => useAsync(customInitialState))
  expect(result.current).toEqual({
    status: 'resolved',
    data: mockData,
    error: null,
    isError: false,
    isIdle: false,
    isLoading: false,
    isSuccess: true,
    reset: expect.any(Function),
    run: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
  })
})

test('can set the data', async () => {
  const {result} = renderHook(() => useAsync())
  const mockData = Symbol('resolved value')

  act(() => result.current.setData(mockData))

  expect(result.current).toEqual({
    status: 'resolved',
    data: mockData,
    error: null,
    isError: false,
    isIdle: false,
    isLoading: false,
    isSuccess: true,
    reset: expect.any(Function),
    run: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
  })
})

test('can set the error', async () => {
  const {result} = renderHook(() => useAsync())
  const mockError = Symbol('rejected value')

  act(() => result.current.setError(mockError))

  expect(result.current).toEqual({
    status: 'rejected',
    data: null,
    error: mockError,
    isError: true,
    isIdle: false,
    isLoading: false,
    isSuccess: false,
    reset: expect.any(Function),
    run: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
  })
})

test('No state updates happen if the component is unmounted while pending', async () => {
  const {promise, resolve} = deferred()
  const {result, unmount} = renderHook(() => useAsync())
  let p
  act(() => {
    p = result.current.run(promise)
  })
  unmount()
  await act(async () => {
    resolve()
    await p
  })
  expect(console.error).not.toHaveBeenCalled()
})

test('calling "run" without a promise results in an early error', async () => {
  const {result} = renderHook(() => useAsync())
  expect(() => result.current.run()).toThrowErrorMatchingInlineSnapshot(
    `"The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?"`,
  )
})
