const { test } = require('tap')
const parseNumber = require('../lib/parse-number')
const ParseError = require('../errors/parse-error')

test('parseNumber(value, keepDecimals, decimalSep)', (t) => {
  // [01] *****************************************************************************************
  t.equal(
    parseNumber('	2 000 kr '), // eslint-disable-line
    2000,
    `[01] parseNumber("\\t2 000 kr ") returns Number(2000)`
  )

  // [02] *****************************************************************************************
  t.equal(
    parseNumber(' 1135.24% '),
    113524,
    `[02] parseNumber(" 1135.24% ") returns Number(113524)`
  )

  // [03] *****************************************************************************************
  t.equal(
    parseNumber(' 1135.24% ', { decSep: '.' }),
    1135,
    `[03] parseNumber(" 1135.24% ", { decSep: "." }) returns Number(1135)`
  )

  // [04] *****************************************************************************************
  t.equal(
    parseNumber(' 1135.24% ', { keepDec: true, decSep: '.' }),
    1135.24,
    `[04] parseNumber(" 1135.24% ", { keepDec: true, decSep: "." }) returns Number(1135.24)`
  )

  // [05] *****************************************************************************************
  t.equal(
    parseNumber(' 1135,24%', { keepDec: true }),
    1135.24,
    `[05] parseNumber(" 1135,24%", { keepDec: true }) returns Number(1135.24)`
  )

  // [06] *****************************************************************************************
  t.equal(
    parseNumber('			 1 000 252.00	', { keepDec: false, decSep: '.' }), // eslint-disable-line
    1000252,
    `[06] parseNumber("\\t\\t\\t 1 000 252.00\\t", { keepDec: false, decSep: "." }) returns Number(1000252)`
  )

  // [07] *****************************************************************************************
  t.throws(
    () => parseNumber(''),
    ParseError,
    `[07] parseNumber("") throws ParseError`
  )

  // [08] *****************************************************************************************
  t.throws(
    () => parseNumber('		'), // eslint-disable-line
    ParseError,
    `[08] parseNumber("\\t\\t") throws ParseError`
  )

  // [09] *****************************************************************************************
  t.throws(
    () => parseNumber(null),
    TypeError,
    `[09] parseNumber(null) throws TypeError`
  )

  // [10] *****************************************************************************************
  t.equal(
    parseNumber(1252),
    1252,
    `[10] parseNumber(1252) returns Number(1252)`
  )

  // [11] *****************************************************************************************
  t.equal(
    parseNumber(1252.72),
    1252,
    `[11] parseNumber(1252.72) returns Number(1252)`
  )

  // [12] *****************************************************************************************
  t.equal(
    parseNumber(1252.72, { keepDec: true }),
    1252.72,
    `[12] parseNumber(1252.72, { keepDec: true }) returns Number(1252.72)`
  )

  // [13] *****************************************************************************************
  t.equal(
    parseNumber('\t<p class="sek">1 200,50 <span class="curr">SEK</span>'),
    1200,
    `[13] parseNumber("<p class='sek'>\\t1 200,50 <span class='curr'>SEK</span>") returns Number(1200)`
  )

  // [14] *****************************************************************************************
  t.throws(
    () => parseNumber('2 000 kr', null),
    TypeError,
    `[14] parseNumber("2 000 kr", null) throws TypeError`
  )

  // [15] *****************************************************************************************
  t.throws(
    () => parseNumber('2 000 kr', 'str'),
    TypeError,
    `[15] parseNumber("2 000 kr", "str") throws TypeError`
  )

  // [16] *****************************************************************************************
  t.throws(
    () => parseNumber('2 000 kr', 12),
    TypeError,
    `[16] parseNumber("2 000 kr", 12) throws TypeError`
  )

  // [17] *****************************************************************************************
  t.throws(
    () => parseNumber('2 000 kr', []),
    TypeError,
    `[17] parseNumber("2 000 kr", []) throws TypeError`
  )

  // [18] *****************************************************************************************
  t.throws(
    () => parseNumber(null, { debug: 1, log: false }),
    TypeError,
    `[18] parseNumber(null, { debug: 1, log: false }) throws TypeError (and should output error to terminal but no log error)`
  )

  // [19] *****************************************************************************************
  t.throws(
    () => parseNumber(null, { debug: 1, log: true }),
    TypeError,
    `[19] parseNumber(null, { debug: 1, log: true }) throws TypeError (and should output error to terminal and log error)`
  )

  // [20] *****************************************************************************************
  t.throws(
    () => parseNumber(null, { debug: 0, log: true }),
    TypeError,
    `[20] parseNumber(null, { debug: 0, log: true }) throws TypeError (and should log error but not output error to terminal)`
  )

  t.end()
})
