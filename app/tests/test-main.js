const { test } = require('tap')
const main = require('../main')
const ValidationError = require('../errors/validation-error')

let describe

test('async main({ creditors, taskFactory })', async (t) => {
  try {
    describe = `[01] Throws ReferenceError when called without arguments`
    await main()
  } catch (e) {
    t.type(e, ReferenceError, describe)
  }
  try {
    describe = `[02] Throws TypeError when given argument null`
    await main(null)
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[03] Throws TypeError when given an array as argument `
    await main([])
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[04] Throws TypeError when given a function as argument`
    await main(() => {})
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[05] Throws TypeError when given a promise as argument`
    await main(Promise.resolve(1))
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[06] Throws TypeError when given a string as argument`
    await main('creditors')
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[07] Throws TypeError when given a number as argument`
    await main(12)
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[08] Throws ValidationError when property 'creditors' is missing in object given as argument`
    await main({ taskFactory: () => {}, taskRunner: () => {} })
  } catch (e) {
    t.type(e, ValidationError, describe)
  }
  try {
    describe = `[09] Throws ValidationError when property 'taskFactory' is missing in object given as argument`
    await main({ creditors: [], taskRunner: () => {} })
  } catch (e) {
    t.type(e, ValidationError, describe)
  }
  try {
    describe = `[10] Throws ValidationError when property 'taskRunner' is missing in object given as argument`
    await main({ creditors: [], taskFactory: () => {} })
  } catch (e) {
    t.type(e, ValidationError, describe)
  }
  try {
    describe = `[10] Throws ValidationError when the value of property 'creditors' is null (for the object given as argument)`
    await main({ creditors: null, taskFactory: () => {}, taskRunner: () => {} })
  } catch (e) {
    t.type(e, ValidationError, describe)
  }
  try {
    describe = `[12] Throws ValidationError when the type of the value of property 'creditors' is a boolean (for the object given as argument)`
    await main({ creditors: true, taskFactory: () => {}, taskRunner: () => {} })
  } catch (e) {
    t.type(e, ValidationError, describe)
  }
  try {
    describe = `[13] Throws ValidationError when the type of the value of property 'creditors' is an object (for the object given as argument)`
    await main({ creditors: {}, taskFactory: () => {}, taskRunner: () => {} })
  } catch (e) {
    t.type(e, ValidationError, describe)
  }
  try {
    describe = `[14] Throws ValidationError when the type of the value of property 'creditors' is a function (for the object given as argument)`
    await main({ creditors: () => {}, taskFactory: () => {}, taskRunner: () => {} })
  } catch (e) {
    t.type(e, ValidationError, describe)
  }
  try {
    describe = `[15] Throws ValidationError when the type of the value of property 'creditors' is a string (for the object given as argument)`
    await main({ creditors: '12', taskFactory: () => {}, taskRunner: () => {} })
  } catch (e) {
    t.type(e, ValidationError, describe)
  }
  try {
    describe = `[16] Throws ValidationError when the type of the value of property 'creditors' is a number (for the object given as argument)`
    await main({ creditors: 12, taskFactory: () => {}, taskRunner: () => {} })
  } catch (e) {
    t.type(e, ValidationError, describe)
  }
  try {
    describe = `[17] Throws ValidationError when the type of the value of property 'creditors' is a promise (for the object given as argument)`
    await main({ creditors: Promise.resolve(1), taskFactory: () => {}, taskRunner: () => {} })
  } catch (e) {
    t.type(e, ValidationError, describe)
  }
  try {
    describe = `[18] Throws ValidationError when the value of property 'taskFactory' is null (for the object given as argument)`
    await main({ creditors: [], taskFactory: null, taskRunner: () => {} })
  } catch (e) {
    t.type(e, ValidationError, describe)
  }
  try {
    describe = `[19] Throws ValidationError when the type of the value of property 'taskFactory' is a boolean (for the object given as argument)`
    await main({ creditors: [], taskFactory: true, taskRunner: () => {} })
  } catch (e) {
    t.type(e, ValidationError, describe)
  }
  try {
    describe = `[20] Throws ValidationError when the type of the value of property 'taskFactory' is an array (for the object given as argument)`
    await main({ creditors: [], taskFactory: [], taskRunner: () => {} })
  } catch (e) {
    t.type(e, ValidationError, describe)
  }
  try {
    describe = `[21] Throws ValidationError when the type of the value of property 'taskFactory' is an object (for the object given as argument)`
    await main({ creditors: [], taskFactory: {}, taskRunner: () => {} })
  } catch (e) {
    t.type(e, ValidationError, describe)
  }
  try {
    describe = `[22] Throws ValidationError when the type of the value of property 'taskFactory' is a string (for the object given as argument)`
    await main({ creditors: [], taskFactory: '12', taskRunner: () => {} })
  } catch (e) {
    t.type(e, ValidationError, describe)
  }
  try {
    describe = `[23] Throws ValidationError when the type of the value of property 'taskFactory' is a number (for the object given as argument)`
    await main({ creditors: [], taskFactory: 12, taskRunner: () => {} })
  } catch (e) {
    t.type(e, ValidationError, describe)
  }
  try {
    describe = `[24] Throws ValidationError when the type of the value of property 'taskFactory' is a promise (for the object given as argument)`
    await main({ creditors: [], taskFactory: Promise.resolve(1), taskRunner: () => {} })
  } catch (e) {
    t.type(e, ValidationError, describe)
  }
  try {
    describe = `[25] Throws ValidationError when the value of property 'taskRunner' is null (for the object given as argument)`
    await main({ creditors: [], taskFactory: () => {}, taskRunner: null })
  } catch (e) {
    t.type(e, ValidationError, describe)
  }
  try {
    describe = `[26] Throws ValidationError when the type of the value of property 'taskRunner' is a boolean (for the object given as argument)`
    await main({ creditors: [], taskFactory: () => {}, taskRunner: true })
  } catch (e) {
    t.type(e, ValidationError, describe)
  }
  try {
    describe = `[27] Throws ValidationError when the type of the value of property 'taskRunner' is an array (for the object given as argument)`
    await main({ creditors: [], taskFactory: () => {}, taskRunner: [] })
  } catch (e) {
    t.type(e, ValidationError, describe)
  }
  try {
    describe = `[28] Throws ValidationError when the type of the value of property 'taskRunner' is an object (for the object given as argument)`
    await main({ creditors: [], taskFactory: () => {}, taskRunner: {} })
  } catch (e) {
    t.type(e, ValidationError, describe)
  }
  try {
    describe = `[29] Throws ValidationError when the type of the value of property 'taskRunner' is a string (for the object given as argument)`
    await main({ creditors: [], taskFactory: () => {}, taskRunner: '12' })
  } catch (e) {
    t.type(e, ValidationError, describe)
  }
  try {
    describe = `[30] Throws ValidationError when the type of the value of property 'taskRunner' is a number (for the object given as argument)`
    await main({ creditors: [], taskFactory: () => {}, taskRunner: 12 })
  } catch (e) {
    t.type(e, ValidationError, describe)
  }
  try {
    describe = `[31] Throws ValidationError when the type of the value of property 'taskRunner' is a promise (for the object given as argument)`
    await main({ creditors: [], taskFactory: () => {}, taskRunner: Promise.resolve(1) })
  } catch (e) {
    t.type(e, ValidationError, describe)
  }
  t.end()
}).catch(test.threw)
