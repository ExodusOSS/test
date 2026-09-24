const testOptimized = jest.exodus.platform === 'nova' ? test.skip : test

testOptimized('count matchers do not materialize call history', () => {
  const fn = jest.fn()
  const { get } = Object.getOwnPropertyDescriptor(fn.mock, 'calls')
  let reads = 0
  Object.defineProperty(fn.mock, 'calls', {
    get() {
      reads++
      return get.call(this)
    },
  })

  expect(fn).not.toHaveBeenCalled()
  expect(fn).not.toBeCalled()
  expect(fn).toHaveBeenCalledTimes(0)
  fn('first')
  expect(fn).toHaveBeenCalledOnce()
  const bound = fn.bind(null, 'second')
  bound()
  expect(fn).toHaveBeenCalled()
  expect(fn).toBeCalled()
  expect(fn).toHaveBeenCalledTimes(2)
  expect(bound).toBeCalledTimes(2)
  expect(fn).not.toHaveBeenCalledTimes(1)
  expect(fn).not.toBeCalledTimes(1)
  expect(reads).toBe(0)
  expect(fn.mock.calls).toEqual([['first'], ['second']])

  fn.mockClear()
  expect(fn).toHaveBeenCalledTimes(0)
  expect(bound).not.toHaveBeenCalled()
  fn()
  expect(fn).toHaveBeenCalledTimes(1)
  fn.mockReset()
  expect(fn).toHaveBeenCalledTimes(0)
  expect(reads).toBe(1)
})

test('count matchers use call history for unregistered mocks', () => {
  const calls = []
  const fn = (...args) => calls.push(args)
  fn._isMockFunction = true
  fn.mock = { calls }

  expect(fn).not.toHaveBeenCalled()
  expect(fn).toHaveBeenCalledTimes(0)
  fn('first')
  expect(fn).toHaveBeenCalled()
  expect(fn).toHaveBeenCalledTimes(1)
  calls.length = 0
  expect(fn).not.toHaveBeenCalled()
  expect(fn).toHaveBeenCalledTimes(0)
})

test('count matchers follow completed calls, including thrown calls', () => {
  let completed = 0
  const fn = jest.fn(() => {
    expect(fn).toHaveBeenCalledTimes(completed)
    throw new Error('mock failure')
  })

  for (let i = 0; i < 2; i++) {
    expect(fn).toThrow('mock failure')
    completed++
    expect(fn).toHaveBeenCalledTimes(completed)
  }
})

test('count matchers still report failures and reject non-mocks', () => {
  const fn = jest.fn()
  expect(() => expect(fn).toHaveBeenCalled()).toThrow()
  expect(() => expect(fn).toHaveBeenCalledTimes(1)).toThrow()
  expect(() => expect(fn).toHaveBeenCalledTimes()).toThrow()
  fn()
  expect(() => expect(fn).not.toHaveBeenCalled()).toThrow()
  expect(() => expect(fn).not.toHaveBeenCalledTimes(1)).toThrow()
  expect(() => expect(() => {}).toHaveBeenCalledTimes(0)).toThrow()
})
