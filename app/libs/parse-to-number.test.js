/**
 * @file Tests for file {@link <install_folder>/libs/parse-to-number.js}
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const { test } = require('tap')
const parseToNumber = require('./parse-to-number')
const ParseError = require('../errors/parse-error')
const XTypeError = require('../errors/xtype-error')

test('parseToNumber(value, keepDecimals, decimalSep)', (t) => {
  const visualTabs = str => str.replace(/\t/g, '\\t') // display tab chars in console as '\t'
  let val = '	2 000 kr ' // eslint-disable-line

  t.same(parseToNumber(val), 2000, `[01] parseToNumber("${visualTabs(val)}") returns Number(2000)`)
  val = ' 1135.24% '
  t.same(parseToNumber(val), 113524, `[02] parseToNumber("${visualTabs(val)}") returns Number(113524)`)
  t.same(parseToNumber(val, false, '.'), 1135, `[03] parseToNumber("${visualTabs(val)}", false, ".") returns Number(1135)`)
  t.same(parseToNumber(val, true, '.'), 1135.24, `[04] parseToNumber("${visualTabs(val)}", true, ".") returns Number(1135.24)`)
  val = ' 1135,24%'
  t.same(parseToNumber(val, true), 1135.24, `[05] parseToNumber("${visualTabs(val)}", true) returns Number(1135.24)`)
  val = '			 1 000 252.00	' // eslint-disable-line
  t.same(parseToNumber(val, false, '.'), 1000252, `[06] parseToNumber("${visualTabs(val)}", false, ".") returns Number(1000252)`)
  val = ''
  t.throws(() => parseToNumber(val), ParseError, `[07] parseToNumber("${visualTabs(val)}") throws ParseError`)
  val = '		' // eslint-disable-line
  t.throws(() => parseToNumber(val), ParseError, `[08] parseToNumber("${visualTabs(val)}") throws ParseError`)
  val = null
  t.throws(() => parseToNumber(val), XTypeError, `[09] parseToNumber(null) throws XTypeError`)
  val = 1252
  t.same(parseToNumber(val), 1252, `[10] parseToNumber(${val}) returns Number(1252)`)
  val = 1252.72
  t.same(parseToNumber(val), 1252, `[11] parseToNumber(${val}) returns Number(1252)`)
  val = 1252.72
  t.same(parseToNumber(val, true), 1252.72, `[12] parseToNumber(${val}, true) returns Number(1252.72)`)

  t.end()
})
