/**
 * @file Tests for file {@link <install_folder>/libs/manual-insert.js}
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const { test } = require('tap')
const manualInsert = require('./manual-insert')

test('manualInsert() invoked with valid arguments', (t) => {
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
  const found = manualInsert(keysVals, dateTimeStub)
  t.same(found, wanted, `[01] manualInsert() returns an object`)
  t.end()
})
