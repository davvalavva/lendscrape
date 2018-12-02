const { test } = require('tap')
const executor = require('../task-factory/staticTable-executor.js')
const ValidationError = require('../errors/validation-error')

const labels = ['Belopp', 'Total']
const rows = [[200, 250], [3000, 3500]]
const response = {}

const task = {
  documentSchemaId: '/schemas/documents/someDocSchema.json#',
  validationErrors() { return null },
  async scraper() { return { labels, rows, response } }
}
const creditor = {
  labelMap: [{ label: 'Belopp', field: 'amount' }, { label: 'Total', field: 'payback' }],
  fieldInject: { providerId: 12 }
}

let describe

test('async executor({ task, creditor })', async (t) => {
  // [01] *****************************************************************************************
  try {
    describe = `[01] Throws TypeError when given no argument`
    await executor()
    t.fail(describe)
  } catch (e) { t.type(e, TypeError, describe) }

  // [02] *****************************************************************************************
  try {
    describe = `[02] Throws TypeError when given null`
    await executor(null)
    t.fail(describe)
  } catch (e) { t.type(e, TypeError, describe) }

  // [03] *****************************************************************************************
  try {
    describe = `[03] Throws TypeError when given an array`
    await executor([])
    t.fail(describe)
  } catch (e) { t.type(e, TypeError, describe) }

  // [04] *****************************************************************************************
  try {
    describe = `[04] Throws TypeError when given a boolean`
    await executor(true)
    t.fail(describe)
  } catch (e) { t.type(e, TypeError, describe) }

  // [05] *****************************************************************************************
  try {
    describe = `[05] Throws TypeError when given a number`
    await executor(12)
    t.fail(describe)
  } catch (e) { t.type(e, TypeError, describe) }

  // [06] *****************************************************************************************
  try {
    describe = `[06] Throws TypeError when given a string`
    await executor('12')
    t.fail(describe)
  } catch (e) { t.type(e, TypeError, describe) }

  // [07] *****************************************************************************************
  try {
    describe = `[07] Throws TypeError when given a function`
    await executor(() => {})
    t.fail(describe)
  } catch (e) { t.type(e, TypeError, describe) }

  // [08] *****************************************************************************************
  try {
    describe = `[08] Throws TypeError when given a promise`
    await executor(Promise.resolve(1))
    t.fail(describe)
  } catch (e) { t.type(e, TypeError, describe) }

  // [09] *****************************************************************************************
  try {
    describe = `[09] Throws TypeError when given no property 'task'`
    await executor({ creditor })
    t.fail(describe)
  } catch (e) { t.type(e, TypeError, describe) }

  // [10] *****************************************************************************************
  try {
    describe = `[10] Throws TypeError when given no property 'creditor'`
    await executor({ task })
    t.fail(describe)
  } catch (e) { t.type(e, TypeError, describe) }

  // [11] *****************************************************************************************
  try {
    describe = `[11] Throws TypeError when property 'scraper' in object 'task' isn't a function`
    const task2 = { ...task, scraper: null }
    await executor({ task: task2, creditor })
    t.fail(describe)
  } catch (e) { t.type(e, TypeError, describe) }

  // [12] *****************************************************************************************
  try {
    describe = `[12] Throws ValidationError when scraped labels doesn't map to field in 'labelMap' array`
    const task2 = { ...task, async scraper() { return { labels: ['Låna', 'Total'], rows, response } } }
    await executor({ task: task2, creditor })
    t.fail(describe)
  } catch (e) { t.type(e, ValidationError, describe) }

  // [13] *****************************************************************************************
  try {
    describe = `[13] Returns object with expected keys and values`
    const actual = await executor({ task, creditor })
    const expected = {
      documents: [
        { amount: 200, payback: 250, providerId: 12 },
        { amount: 3000, payback: 3500, providerId: 12 }
      ],
      response: {}
    }
    t.strictSame(actual, expected, describe)
  } catch (e) { t.fail(describe) }

  // [14] *****************************************************************************************
  try {
    describe = `[14] Throws ValidationError when validationErrors function returns a truthy value (an object in this case))`
    const task2 = { ...task, async validationErrors() { return ({}) } }
    await executor({ task: task2, creditor })
    t.fail(describe)
  } catch (e) { t.type(e, ValidationError, describe) }

  t.end()
})
