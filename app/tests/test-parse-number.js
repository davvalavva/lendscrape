const { test } = require('tap')
const VError = require('verror')
const parseNumber = require('../lib/parse-number')

test('parseNumber(value, keepDecimals, decimalSep)', (t) => {
  // [01] *****************************************************************************************
  t.equal(parseNumber('	2 000 kr '), 2000, `[01] parseNumber("\\t2 000 kr ") returns Number(2000)`) // eslint-disable-line

  // [02] *****************************************************************************************
  t.equal(
    parseNumber(' 1135.24% '), 113524, `[02] parseNumber(" 1135.24% ") returns Number(113524)`)

  // [03] *****************************************************************************************
  t.equal(parseNumber(' 1135.24% ', { decSep: '.' }), 1135, `[03] parseNumber(" 1135.24% ", { decSep: "." }) returns Number(1135)`)

  // [04] *****************************************************************************************
  t.equal(parseNumber(' 1135.24% ', { keepDec: true, decSep: '.' }), 1135.24, `[04] parseNumber(" 1135.24% ", { keepDec: true, decSep: "." }) returns Number(1135.24)`)

  // [05] *****************************************************************************************
  t.equal(parseNumber(' 1135,24%', { keepDec: true }), 1135.24, `[05] parseNumber(" 1135,24%", { keepDec: true }) returns Number(1135.24)`)

  // [06] *****************************************************************************************
  t.equal(parseNumber('			 1 000 252.00	', { keepDec: false, decSep: '.' }), 1000252, `[06] parseNumber("\\t\\t\\t 1 000 252.00\\t", { keepDec: false, decSep: "." }) returns Number(1000252)`) // eslint-disable-line

  // [07] *****************************************************************************************
  t.throws(() => parseNumber(''), VError, `[07] parseNumber("") throws VError`)

  // [08] *****************************************************************************************
  t.throws(() => parseNumber('		'), VError, `[08] parseNumber("\\t\\t") throws VError`) // eslint-disable-line

  // [09] *****************************************************************************************
  t.throws(() => parseNumber(null), VError, `[09] parseNumber(null) throws VError`)

  // [10] *****************************************************************************************
  t.equal(parseNumber(1252), 1252, `[10] parseNumber(1252) returns Number(1252)`)

  // [11] *****************************************************************************************
  t.equal(parseNumber(1252.72), 1252, `[11] parseNumber(1252.72) returns Number(1252)`)

  // [12] *****************************************************************************************
  t.equal(parseNumber(1252.72, { keepDec: true }), 1252.72, `[12] parseNumber(1252.72, { keepDec: true }) returns Number(1252.72)`)

  // [13] *****************************************************************************************
  t.equal(parseNumber('\t<p class="sek">1 200,50 <span class="curr">SEK</span>'), 1200, `[13] parseNumber("<p class='sek'>\\t1 200,50 <span class='curr'>SEK</span>") returns Number(1200)`)

  // [14] *****************************************************************************************
  t.throws(() => parseNumber('2 000 kr', null), VError, `[14] parseNumber("2 000 kr", null) throws VError`)

  // [15] *****************************************************************************************
  t.throws( () => parseNumber('2 000 kr', 'str'), VError, `[15] parseNumber("2 000 kr", "str") throws VError`)

  // [16] *****************************************************************************************
  t.throws(() => parseNumber('2 000 kr', 12), VError, `[16] parseNumber("2 000 kr", 12) throws VError`)

  // [17] *****************************************************************************************
  t.throws(() => parseNumber('2 000 kr', []), VError, `[17] parseNumber("2 000 kr", []) throws VError`)

  t.end()
})
