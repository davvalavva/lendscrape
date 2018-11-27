const { test } = require('tap')
const taskRunner = require('../task-runner')

class StatusCodeError extends Error {}

const throw404 = async () => {
  const err = new StatusCodeError('HTTP 404 error')
  err.response = { statusCode: 404, message: 'HTTP 404: File not found' }
  throw err
}

const schemas = {
  'test-scraper': {
    attemptNo: { keyType: ['number'], min: 1, isInteger: true },
    maxAttempts: { keyType: ['number', 'null'], min: 1, isInteger: true, default: null }, // eslint-disable-line
    creditor: { keyType: ['string'] },
    scraper: { keyType: ['function'] },
    isAsyncScraper: { keyType: ['boolean'] },
    payload: { keyType: ['string'] },
    targetURL: { keyType: ['string'], regExp: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/ }, // eslint-disable-line
    schema: { keyType: ['object'] },
    hdSelector: { keyType: ['string'] },
    trSelector: { keyType: ['string'] },
    labelMap: { keyType: ['array'] },
    fieldInject: { keyType: ['object', 'null'], default: null }
  }
}
const successTask1 = {
  attemptNo: 1,
  maxAttempts: 4,
  creditor: 'testCreditor',
  scraper: async () => ({
    response: {},
    documents: [{ belopp: 100, 'betala-totalt': 150 }, { belopp: 200, 'betala-totalt': 300 }]
  }),
  isAsyncScraper: true,
  payload: 'html',
  targetURL: 'http://localhost:9999',
  schema: {
    belopp: { keyType: ['number'], min: 0, isInteger: true },
    'betala-totalt': { keyType: ['number'], min: 0, isInteger: true }
  },
  hdSelector: 'table > thead > tr > th',
  trSelector: 'table > tbody > tr',
  labelMap: [],
  fieldInject: null
}
const successTask1Result = {
  success: true,
  response: {},
  documents: [{ belopp: 100, 'betala-totalt': 150 }, { belopp: 200, 'betala-totalt': 300 }]
}
const successTask2 = {
  ...successTask1,
  creditor: 'testCreditor2',
  scraper: () => ({
    response: {},
    documents: [{ belopp: 500, 'betala-ungefär': 300 }, { belopp: 600, 'betala-ungefär': 400 }]
  }),
  isAsyncScraper: false,
  schema: {
    belopp: { keyType: ['number'], min: 0, isInteger: true },
    'betala-ungefär': { keyType: ['number'], min: 0, isInteger: true }
  },
  fieldInject: {
    leverantörsId: 2
  }
}
const successTask2Result = {
  success: true,
  response: {},
  documents: [{ belopp: 500, 'betala-ungefär': 300 }, { belopp: 600, 'betala-ungefär': 400 }]
}

let describe

test('async taskRunner(tasks, schemas)', async (t) => {
  // [01] *****************************************************************************************
  try {
    describe = `[01] Throws ReferenceError when called without arguments`
    await taskRunner()
    t.fail(describe)
  } catch (e) {
    t.type(e, ReferenceError, describe)
  }

  // [02] *****************************************************************************************
  try {
    describe = `[02] Throws TypeError when given null as 1st argument`
    await taskRunner(null, schemas)
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [03] *****************************************************************************************
  try {
    describe = `[03] Throws TypeError when given an object as 1st argument`
    await taskRunner({}, schemas)
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [04] *****************************************************************************************
  try {
    describe = `[04] Throws TypeError when given a function as 1st argument`
    await taskRunner(() => {}, schemas)
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [05] *****************************************************************************************
  try {
    describe = `[05] Throws TypeError when given a Promise as 1st argument`
    await taskRunner(Promise.resolve(1), schemas)
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [06] *****************************************************************************************
  try {
    describe = `[06] Throws TypeError when given a boolean as 1st argument`
    await taskRunner(true, schemas)
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [07] *****************************************************************************************
  try {
    describe = `[07] Throws TypeError when given a string as 1st argument`
    await taskRunner('true', schemas)
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [08] *****************************************************************************************
  try {
    describe = `[08] Throws TypeError when given a number as 1st argument`
    await taskRunner(12, schemas)
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [09] *****************************************************************************************
  try {
    describe = `[09] Throws ReferenceError when called without 2nd argument`
    await taskRunner([])
    t.fail(describe)
  } catch (e) {
    t.type(e, ReferenceError, describe)
  }

  // [10] *****************************************************************************************
  try {
    describe = `[10] Throws TypeError when given null as 2nd argument`
    await taskRunner([], null)
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [11] *****************************************************************************************
  try {
    describe = `[11] Throws TypeError when given an array as 2nd argument`
    await taskRunner([], [])
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [12] *****************************************************************************************
  try {
    describe = `[12] Throws TypeError when given a function as 2nd argument`
    await taskRunner([], () => {})
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [13] *****************************************************************************************
  try {
    describe = `[13] Throws TypeError when given a Promise as 2nd argument`
    await taskRunner([], Promise.resolve(1))
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [14] *****************************************************************************************
  try {
    describe = `[14] Throws TypeError when given a boolean as 2nd argument`
    await taskRunner([], true)
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [15] *****************************************************************************************
  try {
    describe = `[15] Throws TypeError when given a string as 2nd argument`
    await taskRunner([], 'true')
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [16] *****************************************************************************************
  try {
    describe = `[16] Throws TypeError when given a number as 2nd argument`
    await taskRunner([], 12)
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [17] *****************************************************************************************
  try {
    describe = `[17] Returns an empty array when given an empty array as 1st argument`
    t.strictSame(await taskRunner([], schemas), [], describe)
  } catch (e) {
    t.fail(describe)
  }

  // [18] *****************************************************************************************
  try {
    describe = `[18] Throws TypeError when given a 3rd argument and the type isn't an array. 3rd argument is only meant to be used by recursive calls.`
    await taskRunner([], schemas, null)
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [19] *****************************************************************************************
  try {
    describe = `[19] Throws TypeError when given a 4th argument and the type isn't a boolean. 4th argument is only meant to be used by recursive calls.`
    await taskRunner([], schemas, [], null)
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [20] *****************************************************************************************
  try {
    describe = `[20] Returns an array with 2 tasks that were successfull when given, as 1st argument, an array of 2 tasks expected to succeed.`
    const actual = await taskRunner([successTask1, successTask2], schemas)
    const expected = [
      { ...successTask1, result: successTask1Result },
      { ...successTask2, result: successTask2Result }
    ]
    t.strictSame(actual, expected, describe)
  } catch (e) {
    t.fail(describe)
  }

  // [21] *****************************************************************************************
  try {
    describe = `[21] Returns an array with 2 tasks where one is successfull and the other fails due to a HTTP 404 error.`
    const failTaskStatus404 = { ...successTask1, scraper: throw404 }
    const failTaskStatus404Result = {
      success: false,
      response: {
        statusCode: 404,
        message: 'HTTP 404: File not found'
      },
      constructor: 'StatusCodeError'
    }
    const actual = await taskRunner([successTask1, failTaskStatus404], schemas)
    const expected = [
      { ...successTask1, result: successTask1Result },
      { ...failTaskStatus404, result: failTaskStatus404Result }
    ]
    t.strictSame(actual, expected, describe)
  } catch (e) {
    t.fail(describe)
  }

  t.end()
}).catch(test.threw)
