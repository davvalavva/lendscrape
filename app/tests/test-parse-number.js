const { test } = require('tap')
const parseNumber = require('../lib/parse-number')
const ParseError = require('../errors/parse-error')

test('parseNumber(value, keepDecimals, decimalSep)', (t) => {
  t.same(
    parseNumber('	2 000 kr '), // eslint-disable-line
    2000,
    `[01] parseNumber("\\t2 000 kr ") returns Number(2000)`
  )
  t.same(
    parseNumber(' 1135.24% '),
    113524,
    `[02] parseNumber(" 1135.24% ") returns Number(113524)`
  )
  t.same(
    parseNumber(' 1135.24% ', { decSep: '.' }),
    1135,
    `[03] parseNumber(" 1135.24% ", { decSep: "." }) returns Number(1135)`
  )
  t.same(
    parseNumber(' 1135.24% ', { keepDec: true, decSep: '.' }),
    1135.24,
    `[04] parseNumber(" 1135.24% ", { keepDec: true, decSep: "." }) returns Number(1135.24)`
  )
  t.same(
    parseNumber(' 1135,24%', { keepDec: true }),
    1135.24,
    `[05] parseNumber(" 1135,24%", { keepDec: true }) returns Number(1135.24)`
  )
  t.same(
    parseNumber('			 1 000 252.00	', { keepDec: false, decSep: '.' }), // eslint-disable-line
    1000252,
    `[06] parseNumber("\\t\\t\\t 1 000 252.00\\t", { keepDec: false, decSep: "." }) returns Number(1000252)`
  )
  t.throws(
    () => parseNumber(''),
    ParseError,
    `[07] parseNumber("") throws ParseError`
  )
  t.throws(
    () => parseNumber('		'), // eslint-disable-line
    ParseError,
    `[08] parseNumber("\\t\\t") throws ParseError`
  )
  t.throws(
    () => parseNumber(null),
    TypeError,
    `[09] parseNumber(null) throws TypeError`
  )
  t.same(
    parseNumber(1252),
    1252,
    `[10] parseNumber(1252) returns Number(1252)`
  )
  t.same(
    parseNumber(1252.72),
    1252,
    `[11] parseNumber(1252.72) returns Number(1252)`
  )
  t.same(
    parseNumber(1252.72, { keepDec: true }),
    1252.72,
    `[12] parseNumber(1252.72, { keepDec: true }) returns Number(1252.72)`
  )
  t.same(
    parseNumber('\t<p class="sek">1 200,50 <span class="curr">SEK</span>'),
    1200,
    `[13] parseNumber("<p class='sek'>\\t1 200,50 <span class='curr'>SEK</span>") returns Number(1200)`
  )
  t.throws(
    () => parseNumber('2 000 kr', null),
    TypeError,
    `[14] parseNumber("2 000 kr", null) throws TypeError`
  )
  t.throws(
    () => parseNumber('2 000 kr', 'str'),
    TypeError,
    `[15] parseNumber("2 000 kr", "str") throws TypeError`
  )
  t.throws(
    () => parseNumber('2 000 kr', 12),
    TypeError,
    `[16] parseNumber("2 000 kr", 12) throws TypeError`
  )
  t.throws(
    () => parseNumber('2 000 kr', []),
    TypeError,
    `[16] parseNumber("2 000 kr", []) throws TypeError`
  )
  t.throws(
    () => parseNumber(null, { debug: 1, log: false }),
    TypeError,
    `[17] parseNumber(null, { debug: 1, log: false }) throws TypeError (and should output error to terminal but no log error)`
  )
  t.throws(
    () => parseNumber(null, { debug: 1, log: true }),
    TypeError,
    `[18] parseNumber(null, { debug: 1, log: true }) throws TypeError (and should output error to terminal and log error)`
  )
  t.throws(
    () => parseNumber(null, { debug: 0, log: true }),
    TypeError,
    `[19] parseNumber(null, { debug: 0, log: true }) throws TypeError (and should log error but not output error to terminal)`
  )

  t.end()
})
