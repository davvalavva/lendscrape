const { test } = require('tap')
const typeName = require('type-name')
const { staticTable } = require('../scrapers')
const StatusCodeError = require('../errors/status-code-error')

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
let describe

test('async staticTable(task)', async (t) => {
  // [01] *****************************************************************************************
  try {
    describe = `[01] Throws TypeError when called without an argument`
    await staticTable()
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [02] *****************************************************************************************
  try {
    describe = `[02] Throws TypeError when passed null`
    await staticTable(null)
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [03] *****************************************************************************************
  try {
    describe = `[03] Throws TypeError when passed an array`
    await staticTable([])
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [04] *****************************************************************************************
  try {
    describe = `[04] Throws TypeError when passed a function`
    await staticTable(() => {})
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [05] *****************************************************************************************
  try {
    describe = `[05] Throws TypeError when passed a promise`
    await staticTable(Promise.resolve(1))
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [06] *****************************************************************************************
  try {
    describe = `[06] Throws TypeError when passed a boolean`
    await staticTable(true)
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [07] *****************************************************************************************
  try {
    describe = `[07] Throws TypeError when passed a number`
    await staticTable(12)
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [08] *****************************************************************************************
  try {
    describe = `[08] Throws TypeError when passed a string`
    await staticTable('12')
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [09] *****************************************************************************************
  try {
    describe = `[09] Throws TypeError when object passed doesn't have a 'request' property with a function value`

    const task = { hdSelector, trSelector }
    await staticTable(task)
    t.fail(describe)
  } catch (e) {
    t.type(e, TypeError, describe)
  }

  // [10] *****************************************************************************************
  try {
    describe = `[10] Throws StatusCodeError when response has status not in range 200-299`

    const task = {
      hdSelector,
      trSelector,
      request() { return { statusCode: '404' } }
    }
    await staticTable(task)
    t.fail(describe)
  } catch (e) {
    t.type(e, StatusCodeError, describe)
  }

  // [11] *****************************************************************************************
  try {
    describe = `[11] Returns object with expected properties and values`

    const task = {
      hdSelector,
      trSelector,
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
