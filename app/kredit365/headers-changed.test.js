/**
 * @file Tests for file {@link <install_folder>/kredit365/headers-changed.js}
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const { test } = require('tap')
const headersChanged = require('./headers-changed')

const headers = [
  'Belopp',
  'Uppl. avg',
  'Fakt. avg',
  'Ränta',
  'Total',
  'Eff. ränta',
  'Nom. ränta'
]
const changedHeaders = [...headers]
changedHeaders[2] = 'Aviavgift'
const headersKeysMap = [
  { mapped: 'belopp', key: 'Belopp' },
  { mapped: 'uppl.avg', key: 'Uppl. avg' },
  { mapped: 'fakt.avg', key: 'Fakt. avg' },
  { mapped: 'ränta (kr)', key: 'Ränta' },
  { mapped: 'betala totalt', key: 'Total' },
  { mapped: 'eff. ränta (%)', key: 'Eff. ränta' },
  { mapped: 'nom. ränta (%)', key: 'Nom. ränta' }
]

test('headersChanged(headers, headersKeysMap)', (t) => {
  t.type(headersChanged(headers, headersKeysMap), 'boolean', `Returns a boolean when given valid arguments`)
  t.same(headersChanged(headers, headersKeysMap), false, `Returns false when given valid arguments and headers haven't changed`)
  t.same(headersChanged(changedHeaders, headersKeysMap), true, `Returns true when given valid arguments and headers have changed`)
  t.throws(() => { headersChanged() }, TypeError, `Throws TypeError when called with no arguments`)
  t.throws(() => { headersChanged(headers) }, TypeError, `Throws TypeError when called without second argument`)
  t.throws(() => { headersChanged({}, headersKeysMap) }, TypeError, `Throws TypeError when first argument is an object`)
  t.throws(() => { headersChanged(() => {}, headersKeysMap) }, TypeError, `Throws TypeError when first argument is a function`)
  t.throws(() => { headersChanged(12, headersKeysMap) }, TypeError, `Throws TypeError when first argument is a number`)
  t.throws(() => { headersChanged('12', headersKeysMap) }, TypeError, `Throws TypeError when first argument is a string`)
  t.throws(() => { headersChanged(null, headersKeysMap) }, TypeError, `Throws TypeError when first argument is null`)
  t.throws(() => { headersChanged(undefined, headersKeysMap) }, TypeError, `Throws TypeError when first argument is undefined`)
  t.throws(() => { headersChanged(headers, {}) }, TypeError, `Throws TypeError when second argument is an object`)
  t.throws(() => { headersChanged(headers, () => {}) }, TypeError, `Throws TypeError when second argument is a function`)
  t.throws(() => { headersChanged(headers, 12) }, TypeError, `Throws TypeError when second argument is a number`)
  t.throws(() => { headersChanged(headers, '12') }, TypeError, `Throws TypeError when second argument is a string`)
  t.throws(() => { headersChanged(headers, null) }, TypeError, `Throws TypeError when second argument is null`)
  t.throws(() => { headersChanged(headers, undefined) }, TypeError, `Throws TypeError when second argument is undefined`)
  t.end()
})
