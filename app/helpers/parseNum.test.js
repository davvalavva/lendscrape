const { test } = require('tap')
const parseNum = require('./parseNum')
const { ParseError } = require('./customErrors')

test('parseNum(value, keepDecimals, decimalSep)', (t) => {
  const visualTabs = str => str.replace(/\t/g, '\\t') // display tab chars in console as '\t'
  let val
  let found
  let signature
  let expected

  val = '	2 000 kr ' // eslint-disable-line
  found = parseNum(val)
  signature = `parseNum("${visualTabs(val)}")`
  expected = 2000
  t.same(found, expected, `${signature} returns Number(${expected})`)

  val = ' 1135.24% '
  found = parseNum(val)
  signature = `parseNum("${visualTabs(val)}")`
  expected = 113524
  t.same(found, expected, `${signature} returns Number(${expected})`)

  val = ' 1135.24% '
  found = parseNum(val, false, '.')
  signature = `parseNum("${visualTabs(val)}", false, ".")`
  expected = 1135
  t.same(found, expected, `${signature} returns Number(${expected})`)

  val = ' 1135.24%'
  found = parseNum(val, true, '.')
  signature = `parseNum("${visualTabs(val)}", true, ".")`
  expected = 1135.24
  t.same(found, expected, `${signature} returns Number(${expected})`)

  val = ' 1135,24%'
  found = parseNum(val, true)
  signature = `parseNum("${visualTabs(val)}", true)`
  expected = 1135.24
  t.same(found, expected, `${signature} returns Number(${expected})`)

  val = '			 1 000 252.00	' // eslint-disable-line
  found = parseNum(val, false, '.')
  signature = `parseNum("${visualTabs(val)}", false, ".")`
  expected = 1000252
  t.same(found, expected, `${signature} returns Number(${expected})`)

  val = ''
  signature = `parseNum("${visualTabs(val)}")`
  t.throws(() => parseNum(val), ParseError, `${signature} throws ParseError`)

  val = '		' // eslint-disable-line
  signature = `parseNum("${visualTabs(val)}")`
  t.throws(() => parseNum(val), ParseError, `${signature} throws ParseError`)

  val = null
  signature = `parseNum(NULL)`
  t.throws(() => parseNum(val), ParseError, `${signature} throws ParseError`)

  val = 1252
  found = parseNum(val)
  signature = `parseNum(${val})`
  expected = 1252
  t.same(found, expected, `${signature} returns Number(${expected})`)

  val = 1252.72
  found = parseNum(val)
  signature = `parseNum(${val})`
  expected = 1252
  t.same(found, expected, `${signature} returns Number(${expected})`)

  val = 1252.72
  found = parseNum(val, true)
  signature = `parseNum(${val}, true)`
  expected = 1252.72
  t.same(found, expected, `${signature} returns Number(${expected})`)
  t.end()
})
