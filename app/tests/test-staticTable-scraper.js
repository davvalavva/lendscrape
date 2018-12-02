const { test } = require('tap')
const typeName = require('type-name')
const VError = require('verror')
const { staticTable } = require('../scrapers')

const html = `<!DOCTYPE html><html><body><table>
<thead>
  <tr>
    <th>  Belopp</th>
    <th>Total </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>200 kr</td>
    <td>  250 kr</td>
  </tr>
  <tr>
    <td><strong> 3 000,00 kr</strong></td>
    <td> 3 500 kr</td>
  </tr>
</tbody></table></body></html>`

const hdSelector = 'table > thead > tr > th'
const trSelector = 'table > tbody > tr'
const targetURL = 'http://localhost:9999'
const request = async () => {}

let describe

test('async staticTable(task)', async (t) => {
  // [01] *****************************************************************************************
  try {
    describe = `[01] Throws VError when given no argument`
    await staticTable()
    t.fail(describe)
  } catch (e) {
    t.type(e, VError, describe)
  }

  // [02] *****************************************************************************************
  try {
    describe = `[02] Throws VError when given null`
    await staticTable(null)
    t.fail(describe)
  } catch (e) {
    t.type(e, VError, describe)
  }

  // [03] *****************************************************************************************
  try {
    describe = `[03] Throws VError when given an array`
    await staticTable([10, [20, 10], 'abc'])
    t.fail(describe)
  } catch (e) {
    t.type(e, VError, describe)
  }

  // [04] *****************************************************************************************
  try {
    describe = `[04] Throws VError when given a function`
    await staticTable(() => {})
    t.fail(describe)
  } catch (e) {
    t.type(e, VError, describe)
  }

  // [05] *****************************************************************************************
  try {
    describe = `[05] Throws VError when given a promise`
    await staticTable(new Promise(() => {}))
    t.fail(describe)
  } catch (e) {
    t.type(e, VError, describe)
  }

  // [06] *****************************************************************************************
  try {
    describe = `[06] Throws VError when given a boolean`
    await staticTable(true)
    t.fail(describe)
  } catch (e) {
    t.type(e, VError, describe)
  }

  // [07] *****************************************************************************************
  try {
    describe = `[07] Throws VError when given a number`
    await staticTable(12)
    t.fail(describe)
  } catch (e) {
    t.type(e, VError, describe)
  }

  // [08] *****************************************************************************************
  try {
    describe = `[08] Throws VError when given a string`
    await staticTable('12')
    t.fail(describe)
  } catch (e) {
    t.type(e, VError, describe)
  }

  // [09] *****************************************************************************************
  try {
    describe = `[09] Throws VError when property 'request' isn't set for the argument object given`

    const task = { hdSelector, trSelector, targetURL }
    await staticTable(task)
    t.fail(describe)
  } catch (e) {
    t.type(e, VError, describe)
  }

  // [10] *****************************************************************************************
  try {
    describe = `[10] Throws VError when property 'targetURL' isn't set for the argument object given`

    const task = { hdSelector, trSelector, request }
    await staticTable(task)
    t.fail(describe)
  } catch (e) {
    t.type(e, VError, describe)
  }

  // [11] *****************************************************************************************
  try {
    describe = `[11] Throws VError when property 'hdSelector' isn't set for the argument object given`

    const task = { trSelector, request, targetURL }
    await staticTable(task)
    t.fail(describe)
  } catch (e) {
    t.type(e, VError, describe)
  }

  // [12] *****************************************************************************************
  try {
    describe = `[12] Throws VError when property 'trSelector' isn't set for the argument object given`

    const task = { hdSelector, request, targetURL }
    await staticTable(task)
    t.fail(describe)
  } catch (e) {
    t.type(e, VError, describe)
  }

  // [13] *****************************************************************************************
  try {
    describe = `[13] Throws VError with error property 'name' set to 'StatusCodeError' when response with status code 404 is returned`

    const task = {
      hdSelector,
      trSelector,
      targetURL,
      request() { return { statusCode: '404' } }
    }
    await staticTable(task)
    t.fail(describe)
  } catch (e) {
    t.strictSame(e.name, 'StatusCodeError', describe)
  }

  // [14] *****************************************************************************************
  try {
    describe = `[14] Throws VError where VError.info(e) returns an object with a property 'statusCode' having the string value of '403' when a HTTP 403 response is returned`

    const task = {
      hdSelector,
      trSelector,
      targetURL,
      request() { return { statusCode: '403' } }
    }
    await staticTable(task)
    t.fail(describe)
  } catch (e) {
    t.strictSame(VError.info(e).statusCode, '403', describe)
  }

  // [15] *****************************************************************************************
  try {
    describe = `[15] Wraps exception thrown in request function inside a VError that rethrows. VError instances property 'name' is set to 'RequestError'`

    const task = {
      hdSelector,
      trSelector,
      targetURL,
      request: () => { throw new TypeError(`error thrown inside request function`) }
    }
    await staticTable(task)
    t.fail(describe)
  } catch (e) {
    if (!e.name === 'RequestError') {
      t.fail(describe)
    } else {
      t.type(e, VError, describe)
    }
    // console.log('***************************')
    // console.log(e.name)
    // console.log('***************************')
    // console.log(e.message)
    // console.log('***************************')
    // console.log(VError.info(e))
    // console.log('***************************')
    // console.log(e.cause().name)
    // console.log('***************************')
    // console.log(e.cause().message)
    // console.log('***************************')
    // console.log(JSON.stringify(e.cause()))
    // console.log('***************************')
    // throw e
  }

  // [16] *****************************************************************************************
  try {
    describe = `[16] Returns object with expected properties and values`

    const task = {
      hdSelector,
      trSelector,
      targetURL,
      request() { return { statusCode: '200', body: html } }
    }
    const expected = {
      labels: ['Belopp', 'Total'],
      rows: [[200, 250], [3000, 3500]]
    }
    const actual = await staticTable(task)
    if (typeName(actual) !== 'Object' || typeName(actual.response) !== 'Object') {
      t.fail(describe)
    } else {
      delete actual.response
      t.strictSame(actual, expected, describe)
    }
  } catch (e) {
    t.fail(describe)
  }

  t.end()
}).catch(test.threw)
