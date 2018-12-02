const { test } = require('tap')
const VError = require('verror')
const staticTableExtract = require('../scrapers/staticTable/extract.js')

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

test('staticTableExtract({ html, hdSelector, trSelector })', (t) => {
  // [01] *****************************************************************************************
  t.throws(() => { staticTableExtract() }, VError, `[01] Throws VError when given no argument`)

  // [02] *****************************************************************************************
  t.throws(() => { staticTableExtract(null) }, VError, `[02] Throws VError when given null`)

  // [03] *****************************************************************************************
  t.throws(() => { staticTableExtract([]) }, VError, `[03] Throws VError when given an array`)

  // [04] *****************************************************************************************
  t.throws(() => { staticTableExtract(() => {}) }, VError, `[04] Throws VError when given a function`)

  // [05] *****************************************************************************************
  t.throws(() => { staticTableExtract(Promise.resolve(1)) }, VError, `[05] Throws VError when given a promise`)

  // [06] *****************************************************************************************
  t.throws(() => { staticTableExtract(true) }, VError, `[06] Throws VError when given a boolean`)

  // [07] *****************************************************************************************
  t.throws(() => { staticTableExtract(12) }, VError, `[07] Throws VError when given a number`)

  // [08] *****************************************************************************************
  t.throws(() => { staticTableExtract('12') }, VError, `[08] Throws VError when given a string`)

  // [09] *****************************************************************************************
  t.throws(() => { staticTableExtract({ hdSelector, trSelector }) }, VError, `[09] Throws VError when missing 'html' property in passed object`)

  // [10] *****************************************************************************************
  t.throws(() => { staticTableExtract({ html: 1, hdSelector, trSelector }) }, VError, `[10] Throws VError when 'html' property isn't a string`)

  // [11] *****************************************************************************************
  t.throws(() => { staticTableExtract({ html, hdSelector: 1, trSelector }) }, VError, `[11] Throws VError when 'hdSelector' property isn't a string`)

  // [12] *****************************************************************************************
  t.throws(() => { staticTableExtract({ html, hdSelector, trSelector: 1 }) }, VError, `[12] Throws VError when 'trSelector' property isn't a string`)

  // [13] *****************************************************************************************
  const expected = { labels: ['Belopp', 'Total'], rows: [[200, 250], [3000, 3500]] }
  const actual = staticTableExtract({ html, hdSelector, trSelector })
  t.strictSame(actual, expected, `[13] Returns object with expected properties and values`)

  t.end()
})
