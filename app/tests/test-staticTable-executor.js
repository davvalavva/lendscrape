const { test } = require('tap')
const VError = require('verror')
const executor = require('../task-factory/staticTable-executor.js')

const labels = ['Belopp', 'Total']
const rows = [[200, 250], [3000, 3500]]
const response = {}

const task = {
  documentSchemaId: '/schemas/documents/paydayVariant1.json#',
  async scraper() { return { labels, rows, response } }
}

const creditor = {
  labelMap:
  [
    { label: 'Belopp', field: 'amount' },
    { label: 'Total', field: 'payback' }
  ],
  fieldInject: { providerId: 12, durationDays: 30, currency: 'SEK' }
}

let describe

test('async executor({ task, creditor })', async (t) => {
  // [01] *****************************************************************************************
  try {
    describe = `[01] Throws VError when given no argument`
    await executor()
    t.fail(describe)
  } catch (e) { t.type(e, VError, describe) }

  // [02] *****************************************************************************************
  try {
    describe = `[02] Throws VError when given null`
    await executor(null)
    t.fail(describe)
  } catch (e) { t.type(e, VError, describe) }

  // [03] *****************************************************************************************
  try {
    describe = `[03] Throws VError when given an array`
    await executor([])
    t.fail(describe)
  } catch (e) { t.type(e, VError, describe) }

  // [04] *****************************************************************************************
  try {
    describe = `[04] Throws VError when given a boolean`
    await executor(true)
    t.fail(describe)
  } catch (e) { t.type(e, VError, describe) }

  // [05] *****************************************************************************************
  try {
    describe = `[05] Throws VError when given a number`
    await executor(12)
    t.fail(describe)
  } catch (e) { t.type(e, VError, describe) }

  // [06] *****************************************************************************************
  try {
    describe = `[06] Throws VError when given a string`
    await executor('12')
    t.fail(describe)
  } catch (e) { t.type(e, VError, describe) }

  // [07] *****************************************************************************************
  try {
    describe = `[07] Throws VError when given a promise`
    await executor(Promise.resolve(1))
    t.fail(describe)
  } catch (e) { t.type(e, VError, describe) }

  // [08] *****************************************************************************************
  try {
    describe = `[08] Throws VError when given no property 'task'`
    await executor({ creditor })
    t.fail(describe)
  } catch (e) { t.type(e, VError, describe) }

  // [09] *****************************************************************************************
  try {
    describe = `[09] Throws VError when given no property 'creditor'`
    await executor({ task })
    t.fail(describe)
  } catch (e) { t.type(e, VError, describe) }

  // [10] *****************************************************************************************
  try {
    describe = `[10] Throws VError when scraped labels doesn't map to 'field' properties in 'labelMap' array`
    const task2 = { ...task, async scraper() { return { labels: ['Låna', 'Total'], rows, response } } }
    await executor({ task: task2, creditor })
    t.fail(describe)
  } catch (e) { t.type(e, Error, describe) }

  // [11] *****************************************************************************************
  try {
    describe = `[11] Returns object with expected keys and values`

    const actual = await executor({ task, creditor })
    const expected = {
      documents: [
        { amount: 200, payback: 250, providerId: 12, currency: 'SEK', durationDays: 30 },
        { amount: 3000, payback: 3500, providerId: 12, currency: 'SEK', durationDays: 30 }
      ],
      response: {}
    }
    t.strictSame(actual, expected, describe)
  } catch (e) { t.fail(describe) }

  // [12] *****************************************************************************************
  try {
    describe = `[12] Throws VError when an injected field name already exists as a scraped field name`

    // because 'amount' exists as value of 'field' property in 'labelMap' objects (case insensitive)
    // the toDocuments() function will throw
    const creditor2 = { ...creditor, fieldInject: { ...creditor.fieldInject, AMOUNT: 12 } }
    await executor({ task, creditor: creditor2 })
    t.fail(describe)
  } catch (e) { t.type(e, VError, describe) }

  // [13] *****************************************************************************************
  try {
    describe = `[13] Throws VError document objects created aren't valid according to schema`
    const creditor2 = { ...creditor }
    delete creditor2.fieldInject
    await executor({ task, creditor2 })
    t.fail(describe)
  } catch (e) { t.type(e, VError, describe) }

  // [14] *****************************************************************************************
  try {
    describe = `[14] Throws VError when validationErrors function returns an object`
    const task2 = { ...task, async validationErrors() { return ({}) } }
    await executor({ task: task2, creditor })
    t.fail(describe)
  } catch (e) { t.type(e, VError, describe) }

  // [15] *****************************************************************************************
  try {
    describe = `[15] Returns object with expected keys and values`

    const body = `<!DOCTYPE html><html><body><table>
    <thead>
      <tr><th>  Belopp</th><th>Total </th></tr>
    </thead>
    <tbody>
      <tr><td>200 kr</td><td>  250 kr</td></tr>
      <tr><td><strong> 3 000,00 kr</strong></td><td> 3 500 kr</td></tr>
    </tbody></table></body></html>`

    const task2 = {
      ...task,
      request: () => ({ body }),
      targetURL: 'http://localhost:9999',
      hdSelector: 'table > thead > tr > th',
      trSelector: 'table > tbody > tr'
    }
    delete task2.scraper

    const actual = await executor({ task: task2, creditor })
    const expected = {
      documents: [
        { amount: 200, payback: 250, providerId: 12, currency: 'SEK', durationDays: 30 },
        { amount: 3000, payback: 3500, providerId: 12, currency: 'SEK', durationDays: 30 }
      ],
      response: {}
    }
    t.strictSame(actual, expected, describe)
  } catch (e) { t.fail(describe) }

  t.end()
})
