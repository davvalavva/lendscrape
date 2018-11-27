const { test } = require('tap')
const settledTaskFactory = require('../task-factory/settled-task-factory')

const task = { attemptNo: 1, maxAttempts: 2 }
let err = new Error()
let tsk
let expected
let actual

test('settledTaskFactory(task, err)', (t) => {
  // [01] *****************************************************************************************
  t.throws(() => { settledTaskFactory() }, TypeError, `[01] Throws TypeError when called without any argument`)

  // [02] *****************************************************************************************
  t.throws(() => { settledTaskFactory(null, err) }, TypeError, `[02] Throws TypeError when called with null as first argument`)

  // [03] *****************************************************************************************
  t.throws(() => { settledTaskFactory([], err) }, TypeError, `[03] Throws TypeError when called with an array as first argument`)

  // [04] *****************************************************************************************
  t.throws(() => { settledTaskFactory(12, err) }, TypeError, `[04] Throws TypeError when called with a number as first argument`)

  // [05] *****************************************************************************************
  t.throws(() => { settledTaskFactory('12', err) }, TypeError, `[05] Throws TypeError when called with a string as first argument`)

  // [06] *****************************************************************************************
  t.throws(() => { settledTaskFactory(true, err) }, TypeError, `[06] Throws TypeError when called with a boolean as first argument`)

  // [07] *****************************************************************************************
  t.throws(() => { settledTaskFactory(() => {}, err) }, TypeError, `[07] Throws TypeError when called with a function as first argument`)

  // [08] *****************************************************************************************
  t.throws(() => { settledTaskFactory(Promise.resolve(1), err) }, TypeError, `[08] Throws TypeError when called with a promise as first argument`)

  // [09] *****************************************************************************************
  t.throws(() => { settledTaskFactory(task) }, TypeError, `[09] Throws TypeError when called with no second argument`)

  // [10] *****************************************************************************************
  t.throws(() => { settledTaskFactory(task, null) }, TypeError, `[10] Throws TypeError when called with null as second argument`)

  // [11] *****************************************************************************************
  t.throws(() => { settledTaskFactory(task, []) }, TypeError, `[11] Throws TypeError when called with an array as second argument`)

  // [12] *****************************************************************************************
  t.throws(() => { settledTaskFactory(task, 12) }, TypeError, `[12] Throws TypeError when called with a number as second argument`)

  // [13] *****************************************************************************************
  t.throws(() => { settledTaskFactory(task, '12') }, TypeError, `[13] Throws TypeError when called with a string as second argument`)

  // [14] *****************************************************************************************
  t.throws(() => { settledTaskFactory(task, true) }, TypeError, `[14] Throws TypeError when called with a boolean as second argument`)

  // [15] *****************************************************************************************
  t.throws(() => { settledTaskFactory(task, () => {}) }, TypeError, `[15] Throws TypeError when called with a function as second argument`)

  // [16] *****************************************************************************************
  t.throws(() => { settledTaskFactory(task, Promise.resolve(1)) }, TypeError, `[16] Throws TypeError when called with a promise as second argument`)

  // [17] *****************************************************************************************
  t.throws(() => { settledTaskFactory(task, {}) }, TypeError, `[17] Throws TypeError when called with an object not being an instance of Error as second argument`)

  // [18] *****************************************************************************************
  err = new Error()
  err.ajv = { propA: 1, propB: 'b' }
  expected = { ...task, result: { error: { jsonValidationError: { propA: 1, propB: 'b' } } } }
  actual = settledTaskFactory(task, err)
  t.strictSame(actual, expected, `[18] Returns an object with expected keys and values`)

  // [19] *****************************************************************************************
  err = new Error()
  err.response = { statusCode: 979 }
  t.equal(settledTaskFactory(task, err), null, `[19] Returns null when given error with status code 979`)

  // [20] *****************************************************************************************
  err = new Error()
  tsk = { ...task, attemptNo: 3 }
  expected = { ...tsk, result: { error: { attemptsMade: 3 } } }
  t.strictSame(settledTaskFactory(tsk, err), expected, `[20] Returns an object with expected keys and values`)

  // [21] *****************************************************************************************
  err = new Error()
  err.response = { statusCode: 400 }
  expected = {
    ...task,
    result: {
      response: { statusCode: 400 },
      error: { statusCode: 400 }
    }
  }
  actual = settledTaskFactory(task, err)
  t.strictSame(actual, expected, `[21] Returns an object with expected keys and values`)

  // [22] *****************************************************************************************
  err = new Error()
  err.response = { statusCode: 989 }
  tsk = { attemptNo: 1893 } // no 'maxAttempts' on purpose
  expected = {
    ...tsk,
    result: {
      response: { statusCode: 989 },
      error: { statusCode: 989, attemptsMade: 1893 }
    }
  }
  actual = settledTaskFactory(tsk, err)
  t.strictSame(actual, expected, `[22] Returns an object with expected keys and values`)

  t.end()
})
