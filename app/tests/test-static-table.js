const { test } = require('tap')
const { staticTable } = require('../scrapers')

const html = `<!DOCTYPE html><html><body><table>
<thead>
  <tr>
    <th>Belopp</th>
    <th>Total</th>
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
const htmlChanged = `<!DOCTYPE html><html><body><table>
<thead>
  <tr>
    <th>Låna</th>
    <th>Total</th></tr>
</thead>
<tbody>
  <tr>
    <td>200 kr</td>
    <td>  13 kr </td>
  </tr>
  <tr>
    <td><strong> 3 000,00 kr</strong>
    </td><td>19 kr</td>
  </tr>
</tbody></table></body></html>`

const requestPromiseNativeStub = ({ uri }) => {
  if (uri === 'http://localhost:9999') {
    return { statusCode: 200, body: html }
  }
  if (uri === 'http://localhost:9999/changed.html') {
    return { statusCode: 200, body: htmlChanged }
  }
  return null
}

const task = {
  hdSelector: 'table > thead > tr > th',
  trSelector: 'table > tbody > tr',
  targetURL: 'http://localhost:9999',
  request: requestPromiseNativeStub,
  documentSchema: {
    type: 'object',
    required: ['providerId', 'amount', 'payback'],
    properties: {
      providerId: { type: 'integer' }, amount: { type: 'integer' }, payback: { type: 'integer' }
    }
  },
  labelMap: [{ label: 'Belopp', field: 'amount' }, { label: 'Total', field: 'payback' }],
  fieldInject: { providerId: 1 }
}
const expected = [
  { amount: 200, payback: 250, providerId: 1 },
  { amount: 3000, payback: 3500, providerId: 1 }
]
let adjustedTask
let actual
let describe
let result
test('staticTable(task)', async (t) => {
  try {
    await staticTable()
  } catch (e) {
    t.type(e, TypeError, `[01] Throws TypeError when called without an argument`)
  }
  try {
    await staticTable([])
  } catch (e) {
    t.type(e, TypeError, `[02] Throws TypeError when passed an array as argument`)
  }
  try {
    adjustedTask = { ...task }
    delete adjustedTask.request
    await staticTable(adjustedTask)
  } catch (e) {
    t.type(e, Error, `[03] Throws an error when property 'request' missing in task object passed`)
  }
  try {
    adjustedTask = { ...task }
    delete adjustedTask.hdSelector
    await staticTable(adjustedTask)
  } catch (e) {
    t.type(e, Error, `[04] Throws an error when missing property 'hdSelector' in task object passed`)
  }
  try {
    adjustedTask = { ...task }
    delete adjustedTask.trSelector
    await staticTable(adjustedTask)
  } catch (e) {
    t.type(e, Error, `[05] Throws an error when missing property 'trSelector' in task object passed`)
  }
  try {
    adjustedTask = { ...task }
    delete adjustedTask.documentSchema
    await staticTable(adjustedTask)
  } catch (e) {
    t.type(e, Error, `[06] Throws an error when missing property 'documentSchema' in task object passed`)
  }
  try {
    adjustedTask = { ...task }
    delete adjustedTask.labelMap
    await staticTable(adjustedTask)
  } catch (e) {
    t.type(e, Error, `[07] Throws an error when missing property 'labelMap' in task object passed`)
  }
  try {
    adjustedTask = { ...task }
    adjustedTask.request = {}
    await staticTable(adjustedTask)
  } catch (e) {
    t.type(e, Error, `[08] Throws an error when property 'request' in passed task object is not a function`)
  }
  try {
    adjustedTask = { ...task }
    adjustedTask.hdSelector = {}
    await staticTable(adjustedTask)
  } catch (e) {
    t.type(e, Error, `[09] Throws an error when property 'hdSelector' in passed task object is not a string`)
  }
  try {
    adjustedTask = { ...task }
    adjustedTask.trSelector = {}
    await staticTable(adjustedTask)
  } catch (e) {
    t.type(e, Error, `[10] Throws an error when property 'trSelector' in passed task object is not a string`)
  }
  try {
    adjustedTask = { ...task }
    adjustedTask.documentSchema = {}
    await staticTable(adjustedTask)
  } catch (e) {
    t.type(e, Error, `[11] Throws an error when property 'documentSchema' in passed task object is not a string or an object`)
  }
  try {
    adjustedTask = { ...task }
    adjustedTask.labelMap = {}
    await staticTable(adjustedTask)
  } catch (e) {
    t.type(e, Error, `[12] Throws an error when property 'labelMap' in passed task object is not an array`)
  }
  try {
    adjustedTask = { ...task }
    adjustedTask.fieldInject = []
    await staticTable(adjustedTask)
  } catch (e) {
    t.type(e, Error, `[13] Throws an error when property 'fieldInject' in passed task object is not an object`)
  }
  try {
    describe = `[14] Returns an object with a property 'documents' (an array) populated with identical objects, properties and values compared to prepared fixture.`
    result = await staticTable(task)
    actual = result.documents
    t.strictSame(actual, expected, describe)
  } catch (e) {
    t.fail(describe)
  }
  t.end()
}).catch(test.threw)
