const { test } = require('tap')
const parseToNumber = require('./parse-to-number')
const ParseError = require('../errors/parse-error')

test('parseToNumber(value, keepDecimals, decimalSep)', (t) => {
  t.same(
    parseToNumber('	2 000 kr '), // eslint-disable-line
    2000,
    `[01] parseToNumber("\\t2 000 kr ") returns Number(2000)`
  )
  t.same(
    parseToNumber(' 1135.24% '),
    113524,
    `[02] parseToNumber(" 1135.24% ") returns Number(113524)`
  )
  t.same(
    parseToNumber(' 1135.24% ', { decSep: '.' }),
    1135,
    `[03] parseToNumber(" 1135.24% ", { decSep: "." }) returns Number(1135)`
  )
  t.same(
    parseToNumber(' 1135.24% ', { keepDec: true, decSep: '.' }),
    1135.24,
    `[04] parseToNumber(" 1135.24% ", { keepDec: true, decSep: "." }) returns Number(1135.24)`
  )
  t.same(
    parseToNumber(' 1135,24%', { keepDec: true }),
    1135.24,
    `[05] parseToNumber(" 1135,24%", { keepDec: true }) returns Number(1135.24)`
  )
  t.same(
    parseToNumber('			 1 000 252.00	', { keepDec: false, decSep: '.' }), // eslint-disable-line
    1000252,
    `[06] parseToNumber("\\t\\t\\t 1 000 252.00\\t", { keepDec: false, decSep: "." }) returns Number(1000252)`
  )
  t.throws(
    () => parseToNumber(''),
    ParseError,
    `[07] parseToNumber("") throws ParseError`
  )
  t.throws(
    () => parseToNumber('		'), // eslint-disable-line
    ParseError,
    `[08] parseToNumber("\\t\\t") throws ParseError`
  )
  t.throws(
    () => parseToNumber(null),
    TypeError,
    `[09] parseToNumber(null) throws TypeError`
  )
  t.same(
    parseToNumber(1252),
    1252,
    `[10] parseToNumber(1252) returns Number(1252)`
  )
  t.same(
    parseToNumber(1252.72),
    1252,
    `[11] parseToNumber(1252.72) returns Number(1252)`
  )
  t.same(
    parseToNumber(1252.72, { keepDec: true }),
    1252.72,
    `[12] parseToNumber(1252.72, { keepDec: true }) returns Number(1252.72)`
  )
  t.same(
    parseToNumber('\t<p class="sek">1 200,50 <span class="curr">SEK</span>'),
    1200,
    `[13] parseToNumber("<p class='sek'>\\t1 200,50 <span class='curr'>SEK</span>") returns Number(1200)`
  )

  t.end()
})
