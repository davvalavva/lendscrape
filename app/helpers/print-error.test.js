/**
 * @file Tests for file {@link <install_folder>/helpers/print-error.js}
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const { test } = require('tap')
const printError = require('./print-error')
const ValidationError = require('../config/ValidationError')

test('printError(errorInstance, env /* env injection is only for testing purposes */)', (t) => {
  t.throws(() => { printError() }, TypeError, `Throws TypeError when no argument given`)
  t.throws(() => { printError(null) }, TypeError, `Throws TypeError when argument is null`)
  t.throws(() => { printError(undefined) }, TypeError, `Throws TypeError when argument is undefined`)
  t.throws(() => { printError([]) }, TypeError, `Throws TypeError when argument is an array`)
  t.throws(() => { printError(() => {}) }, TypeError, `Throws TypeError when argument is a function`)
  t.throws(() => { printError(Promise.resolve(1)) }, TypeError, `Throws TypeError when argument is a promise`)
  t.throws(() => { printError(12) }, TypeError, `Throws TypeError when argument is a number`)
  t.throws(() => { printError('12') }, TypeError, `Throws TypeError when argument is a string`)
  t.throws(() => { printError({}) }, TypeError, `Throws TypeError when argument is an object that is not an instance of Error`)

  const valiErrInstance = new ValidationError(100, 'error message', 'file.js', { scopeVar: 'abc' })
  let env = { rulerChar: '*' }
  t.throws(() => { printError(valiErrInstance, env) }, ReferenceError, `Throws ReferenceError when enviroment setting 'rulerLen' doesn't exist`)
  env = { rulerChar: '*' }
  t.throws(() => { printError(valiErrInstance, env) }, ReferenceError, `Throws ReferenceError when enviroment setting 'rulerLen' doesn't exist`)
  env = { rulerLen: '123', rulerChar: '*' }
  t.throws(() => { printError(valiErrInstance, env) }, TypeError, `Throws TypeError when enviroment setting 'rulerLen' is a string`)
  env = { rulerLen: [], rulerChar: '*' }
  t.throws(() => { printError(valiErrInstance, env) }, TypeError, `Throws TypeError when enviroment setting 'rulerLen' is an array`)
  env = { rulerLen: {}, rulerChar: '*' }
  t.throws(() => { printError(valiErrInstance, env) }, TypeError, `Throws TypeError when enviroment setting 'rulerLen' is an object`)
  env = { rulerLen: 114 }
  t.throws(() => { printError(valiErrInstance, env) }, ReferenceError, `Throws ReferenceError when enviroment setting 'rulerChar' doesn't exist`)
  env = { rulerLen: 114, rulerChar: 123 }
  t.throws(() => { printError(valiErrInstance, env) }, TypeError, `Throws TypeError when enviroment setting 'rulerChar' is a number`)
  env = { rulerLen: 114, rulerChar: [] }
  t.throws(() => { printError(valiErrInstance, env) }, TypeError, `Throws TypeError when enviroment setting 'rulerChar' is an array`)
  env = { rulerLen: 114, rulerChar: {} }
  t.throws(() => { printError(valiErrInstance, env) }, TypeError, `Throws TypeError when enviroment setting 'rulerChar' is an object`)

  t.end()
})
