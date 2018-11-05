/**
 * @file Tests for file {@link <install_folder>/libs/parse-to-number.js}
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const { test } = require('tap')
const parseToNumber = require('./parse-to-number')
const ParseError = require('../error_types/parse-error')
const XTypeError = require('../error_types/xtype-error')

test('parseToNumber(value, keepDecimals, decimalSep)', (t) => {
  const visualTabs = str => str.replace(/\t/g, '\\t') // display tab chars in console as '\t'
  let val
  let found
  let signature
  let expected

  val = '	2 000 kr ' // eslint-disable-line
  found = parseToNumber(val)
  signature = `parseToNumber("${visualTabs(val)}")`
  expected = 2000
  t.same(found, expected, `${signature} returns Number(${expected})`)

  val = ' 1135.24% '
  found = parseToNumber(val)
  signature = `parseToNumber("${visualTabs(val)}")`
  expected = 113524
  t.same(found, expected, `${signature} returns Number(${expected})`)

  val = ' 1135.24% '
  found = parseToNumber(val, false, '.')
  signature = `parseToNumber("${visualTabs(val)}", false, ".")`
  expected = 1135
  t.same(found, expected, `${signature} returns Number(${expected})`)

  val = ' 1135.24%'
  found = parseToNumber(val, true, '.')
  signature = `parseToNumber("${visualTabs(val)}", true, ".")`
  expected = 1135.24
  t.same(found, expected, `${signature} returns Number(${expected})`)

  val = ' 1135,24%'
  found = parseToNumber(val, true)
  signature = `parseToNumber("${visualTabs(val)}", true)`
  expected = 1135.24
  t.same(found, expected, `${signature} returns Number(${expected})`)

  val = '			 1 000 252.00	' // eslint-disable-line
  found = parseToNumber(val, false, '.')
  signature = `parseToNumber("${visualTabs(val)}", false, ".")`
  expected = 1000252
  t.same(found, expected, `${signature} returns Number(${expected})`)

  val = ''
  signature = `parseToNumber("${visualTabs(val)}")`
  t.throws(() => parseToNumber(val), ParseError, `${signature} throws ParseError`)

  val = '		' // eslint-disable-line
  signature = `parseToNumber("${visualTabs(val)}")`
  t.throws(() => parseToNumber(val), ParseError, `${signature} throws ParseError`)

  val = null
  signature = `parseToNumber(NULL)`
  t.throws(() => parseToNumber(val), XTypeError, `${signature} throws XTypeError`)

  val = 1252
  found = parseToNumber(val)
  signature = `parseToNumber(${val})`
  expected = 1252
  t.same(found, expected, `${signature} returns Number(${expected})`)

  val = 1252.72
  found = parseToNumber(val)
  signature = `parseToNumber(${val})`
  expected = 1252
  t.same(found, expected, `${signature} returns Number(${expected})`)

  val = 1252.72
  found = parseToNumber(val, true)
  signature = `parseToNumber(${val}, true)`
  expected = 1252.72
  t.same(found, expected, `${signature} returns Number(${expected})`)
  t.end()
})
