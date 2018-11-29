const { test } = require('tap')
const staticTableExtract = require('../scrapers/staticTable-scraper/extract.js')

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
  t.throws(() => { staticTableExtract() }, TypeError, `[01] Throws TypeError when called without any argument`)

  // [02] *****************************************************************************************
  t.throws(() => { staticTableExtract(null) }, TypeError, `[02] Throws TypeError when passed null`)

  // [03] *****************************************************************************************
  t.throws(() => { staticTableExtract([]) }, TypeError, `[03] Throws TypeError when passed an array`)

  // [04] *****************************************************************************************
  t.throws(() => { staticTableExtract(() => {}) }, TypeError, `[04] Throws TypeError when passed a function`)

  // [05] *****************************************************************************************
  t.throws(() => { staticTableExtract(Promise.resolve(1)) }, TypeError, `[05] Throws TypeError when passed a promise`)

  // [06] *****************************************************************************************
  t.throws(() => { staticTableExtract(true) }, TypeError, `[06] Throws TypeError when passed a boolean`)

  // [07] *****************************************************************************************
  t.throws(() => { staticTableExtract(12) }, TypeError, `[07] Throws TypeError when passed a number`)

  // [08] *****************************************************************************************
  t.throws(() => { staticTableExtract('12') }, TypeError, `[08] Throws TypeError when passed a string`)

  // [09] *****************************************************************************************
  t.throws(() => { staticTableExtract({ hdSelector, trSelector }) }, TypeError, `[09] Throws TypeError when missing 'html' property in passed object`)

  // [10] *****************************************************************************************
  t.throws(() => { staticTableExtract({ html: 1, hdSelector, trSelector }) }, TypeError, `[10] Throws TypeError when 'html' property isn't a string`)

  // [11] *****************************************************************************************
  t.throws(() => { staticTableExtract({ html, hdSelector: 1, trSelector }) }, TypeError, `[11] Throws TypeError when 'hdSelector' property isn't a string`)

  // [12] *****************************************************************************************
  t.throws(() => { staticTableExtract({ html, hdSelector, trSelector: 1 }) }, TypeError, `[12] Throws TypeError when 'trSelector' property isn't a string`)

  // [13] *****************************************************************************************
  const expected = { labels: ['Belopp', 'Total'], rows: [[200, 250], [3000, 3500]] }
  const actual = staticTableExtract({ html, hdSelector, trSelector })
  t.strictSame(actual, expected, `[13] Returns object with expected properties and values`)

  t.end()
})
