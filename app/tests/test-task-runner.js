const { test } = require('tap')
const taskRunner = require('../task-runner')

const task1 = {
  attemptNo: 1,
  maxAttempts: 2,
  creditor: 'testCreditor-1',
  request: async () => {},
  targetURL: 'http://localhost:9999/testpage1.html',
  documentSchemaId: '/schemas/documents/testSchema.json#',
  hdSelector: 'thead > tr > th',
  trSelector: 'tbody > tr',
  async execute() { return { documents: [] } }
}
const task2 = {
  ...task1,
  creditor: 'testCreditor-2',
  targetURL: 'http://localhost:9999/testpage1.html'
}

let describe

test('async taskRunner(tasks)', async (t) => {
  // [01] *****************************************************************************************
  try {
    describe = `[01] Throws TypeError when given no arguments`
    await taskRunner()
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [02] *****************************************************************************************
  try {
    describe = `[02] Throws TypeError when given null`
    await taskRunner(null)
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [03] *****************************************************************************************
  try {
    describe = `[03] Throws TypeError when given a boolean`
    await taskRunner(true)
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [04] *****************************************************************************************
  try {
    describe = `[04] Throws TypeError when given a number`
    await taskRunner(12)
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [05] *****************************************************************************************
  try {
    describe = `[05] Throws TypeError when given a string`
    await taskRunner('12')
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [06] *****************************************************************************************
  try {
    describe = `[06] Throws TypeError when given a function`
    await taskRunner(() => {})
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [07] *****************************************************************************************
  try {
    describe = `[07] Throws TypeError when given a promise`
    await taskRunner(Promise.resolve(1))
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [08] *****************************************************************************************
  try {
    describe = `[08] Throws TypeError when given an array`
    await taskRunner([])
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [09] *****************************************************************************************
  try {
    describe = `[09] Throws TypeError when argument object doesn't have a property 'tasks'`
    await taskRunner({})
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [10] *****************************************************************************************
  try {
    describe = `[10] Throws TypeError when property 'tasks' of argument object is an empty array`
    await taskRunner({ tasks: [] })
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [11] *****************************************************************************************
  try {
    describe = `[11] Returns an array with 2 task objects representing successful operations`
    const expected = [
      { ...task1, result: { documents: [] } },
      { ...task2, result: { documents: [] } }
    ]
    const actual = await taskRunner({ tasks: [{ ...task1 }, { ...task2 }] })

    t.strictSame(actual, expected, describe)
  } catch (e) {
    t.fail(describe)
    throw e
  }

  // [12] *****************************************************************************************
  // try {
  //   describe = `[12] Returns an array with 2 task objects, one representing a successful operation and the other a failed task due to a 404 error`

  //   const errExecute = () => {
  //     const err = new StatusCodeError(`File not found`)
  //     err.response = { statusCode: 404, body: {} }
  //     throw err
  //   }
  //   const expected = [
  //     {
  //       ...task1,
  //       maxAttempts: 5,
  //       execute: errExecute,
  //       result: {
  //         error: { statusCode: 404, attemptsMade: 1 },
  //         response: { statusCode: 404 }
  //       }
  //     },
  //     { ...task2, result: { documents: [] } }
  //   ]
  //   const actual = await taskRunner({
  //     tasks: [
  //       { ...task1, maxAttempts: 5, execute: errExecute },
  //       { ...task2 }
  //     ]
  //   })

  //   t.strictSame(actual, expected, describe)
  // } catch (e) {
  //   t.fail(describe)
  //   throw e
  // }

  // [13] *****************************************************************************************
  // try {
  //   describe = `[13] Returns an array with 2 task objects, one representing a successful operation and the other a failed task due to a 408 error`

  //   const errExecute = () => {
  //     const err = new StatusCodeError(`Request Timeout`)
  //     err.response = { statusCode: 408, body: {} }
  //     throw err
  //   }
  //   const expected = [
  //     { ...task2, result: { documents: [] } },
  //     {
  //       ...task1,
  //       maxAttempts: 5,
  //       attemptNo: 5,
  //       execute: errExecute,
  //       result: {
  //         error: { statusCode: 408, attemptsMade: 5 },
  //         response: { statusCode: 408 }
  //       }
  //     }
  //   ]
  //   const actual = await taskRunner({
  //     tasks: [
  //       { ...task1, maxAttempts: 5, execute: errExecute },
  //       { ...task2 }
  //     ]
  //   })

  //   t.strictSame(actual, expected, describe)
  // } catch (e) {
  //   t.fail(describe)
  //   throw e
  // }

  // [14] *****************************************************************************************
  try {
    describe = `[14] Returns an array with 2 task objects, one representing a successful operation and the other a failed task due to a scraping error`

    const errExecute = () => {
      const err = new Error(`Invalid document`)
      err.ajv = { a: 1, b: 2 }
      throw err
    }
    const expected = [
      {
        ...task1,
        maxAttempts: 5,
        attemptNo: 1,
        execute: errExecute,
        result: {
          error: { jsonValidationError: { a: 1, b: 2 } }
        }
      },
      { ...task2, result: { documents: [] } }
    ]
    const actual = await taskRunner({
      tasks: [
        { ...task1, maxAttempts: 5, execute: errExecute },
        { ...task2 }
      ]
    })

    t.strictSame(actual, expected, describe)
  } catch (e) {
    t.fail(describe)
    throw e
  }

  t.end()
}).catch(test.threw)
