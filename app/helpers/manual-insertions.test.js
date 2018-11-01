/**
 * @file Tests for file {@link <install_folder>/helpers/manual-insertions.js}
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson <david.jonsson@pm.me>
 */

const { test } = require('tap')
const manualVals = require('./manual-insertions')

test('manualVals() invoked with valid arguments', (t) => {
  const dateTimeStub = () => '2018-10-30 18:58:18 UTC+1'
  const keysVals = [
    { key: 'löptid (d)', value: 30 },
    { key: 'leverantörsId', value: 1 },
    { key: 'senaste kontroll', value: 'now()' },
    { key: 'senaste ändring', value: 'now()' }
  ]
  const wanted = {
    'löptid (d)': 30,
    leverantörsId: 1,
    'senaste kontroll': '2018-10-30 18:58:18 UTC+1',
    'senaste ändring': '2018-10-30 18:58:18 UTC+1'
  }
  const found = manualVals(keysVals, dateTimeStub)
  t.same(found, wanted, `manualVals() returns an object`)
  t.end()
})
