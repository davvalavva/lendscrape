/**
 * @file Tests for file {@link <install_folder>/helpers/print-error.js}
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const { test } = require('tap')
const printError = require('./print-error')

test('printError(errData)', (t) => {
  let data
  let env

  data = {
    name: 'myError', code: 208, message: 'Ops', fileName: 'file.js', reason: 'whatever', rulerLen: 10, rulerChar: '='
  }
  t.throws(() => { printError() }, TypeError, `Throws TypeError when no argument given`)
  t.throws(() => { printError(null) }, TypeError, `Throws TypeError when argument is null`)
  t.throws(() => { printError(undefined) }, TypeError, `Throws TypeError when argument is undefined`)
  t.throws(() => { printError([]) }, TypeError, `Throws TypeError when argument is an array`)
  t.throws(() => { printError(() => {}) }, TypeError, `Throws TypeError when argument is a function`)
  t.throws(() => { printError(Promise.resolve(1)) }, TypeError, `Throws TypeError when argument is a promise`)
  t.throws(() => { printError(12) }, TypeError, `Throws TypeError when argument is a number`)
  t.throws(() => { printError('12') }, TypeError, `Throws TypeError when argument is a string`)
  t.throws(() => { printError({}) }, TypeError, `Throws TypeError when argument is an empty object`)
  data = {
    code: 208, message: 'Ops', fileName: 'file.js', reason: 'whatever', rulerLen: 10, rulerChar: '='
  }
  t.throws(() => { printError(data) }, TypeError, `Throws TypeError when argument missing name property`)
  data = {
    name: undefined, code: 208, message: 'Ops', fileName: 'file.js', reason: 'whatever', rulerLen: 10, rulerChar: '='
  }
  t.throws(() => { printError(data) }, TypeError, `Throws TypeError when property 'name' in argument is undefined`)
  data = {
    name: null, code: 208, message: 'Ops', fileName: 'file.js', reason: 'whatever', rulerLen: 10, rulerChar: '='
  }
  t.throws(() => { printError(data) }, TypeError, `Throws TypeError when property 'name' in argument is null`)
  data = {
    name: [], code: 208, message: 'Ops', fileName: 'file.js', reason: 'whatever', rulerLen: 10, rulerChar: '='
  }
  t.throws(() => { printError(data) }, TypeError, `Throws TypeError when property 'name' in argument is an array`)
  data = {
    name: {}, code: 208, message: 'Ops', fileName: 'file.js', reason: 'whatever', rulerLen: 10, rulerChar: '='
  }
  t.throws(() => { printError(data) }, TypeError, `Throws TypeError when property 'name' in argument is an object`)
  data = {
    name: 12, code: 208, message: 'Ops', fileName: 'file.js', reason: 'whatever', rulerLen: 10, rulerChar: '='
  }
  t.throws(() => { printError(data) }, TypeError, `Throws TypeError when property 'name' in argument is a number`)

  data = {
    name: 'myError', code: undefined, message: 'Ops', fileName: 'file.js', reason: 'whatever', rulerLen: 10, rulerChar: '='
  }
  t.throws(() => { printError(data) }, TypeError, `Throws TypeError when property 'code' in argument is undefined`)
  data = {
    name: 'myError', code: null, message: 'Ops', fileName: 'file.js', reason: 'whatever', rulerLen: 10, rulerChar: '='
  }
  t.throws(() => { printError(data) }, TypeError, `Throws TypeError when property 'code' in argument is null`)
  data = {
    name: 'myError', code: [], message: 'Ops', fileName: 'file.js', reason: 'whatever', rulerLen: 10, rulerChar: '='
  }
  t.throws(() => { printError(data) }, TypeError, `Throws TypeError when property 'code' in argument is an array`)
  data = {
    name: 'myError', code: {}, message: 'Ops', fileName: 'file.js', reason: 'whatever', rulerLen: 10, rulerChar: '='
  }
  t.throws(() => { printError(data) }, TypeError, `Throws TypeError when property 'code' in argument is an object`)
  data = {
    name: 'myError', code: '208', message: 'Ops', fileName: 'file.js', reason: 'whatever', rulerLen: 10, rulerChar: '='
  }
  t.throws(() => { printError(data) }, TypeError, `Throws TypeError when property 'code' in argument is a string`)

  data = {
    name: 'myError', code: 208, message: undefined, fileName: 'file.js', reason: 'whatever', rulerLen: 10, rulerChar: '='
  }
  t.throws(() => { printError(data) }, TypeError, `Throws TypeError when property 'message' in argument is undefined`)
  data = {
    name: 'myError', code: 208, message: null, fileName: 'file.js', reason: 'whatever', rulerLen: 10, rulerChar: '='
  }
  t.throws(() => { printError(data) }, TypeError, `Throws TypeError when property 'message' in argument is null`)
  data = {
    name: 'myError', code: 208, message: [], fileName: 'file.js', reason: 'whatever', rulerLen: 10, rulerChar: '='
  }
  t.throws(() => { printError(data) }, TypeError, `Throws TypeError when property 'message' in argument is an array`)
  data = {
    name: 'myError', code: 208, message: {}, fileName: 'file.js', reason: 'whatever', rulerLen: 10, rulerChar: '='
  }
  t.throws(() => { printError(data) }, TypeError, `Throws TypeError when property 'message' in argument is an object`)
  data = {
    name: 'myError', code: 208, message: 123, fileName: 'file.js', reason: 'whatever', rulerLen: 10, rulerChar: '='
  }
  t.throws(() => { printError(data) }, TypeError, `Throws TypeError when property 'message' in argument is a number`)

  data = {
    name: 'myError', code: 208, message: 'Ops', fileName: undefined, reason: 'whatever', rulerLen: 10, rulerChar: '='
  }
  t.throws(() => { printError(data) }, TypeError, `Throws TypeError when property 'fileName' in argument is undefined`)
  data = {
    name: 'myError', code: 208, message: 'Ops', fileName: null, reason: 'whatever', rulerLen: 10, rulerChar: '='
  }
  t.throws(() => { printError(data) }, TypeError, `Throws TypeError when property 'fileName' in argument is null`)
  data = {
    name: 'myError', code: 208, message: 'Ops', fileName: [], reason: 'whatever', rulerLen: 10, rulerChar: '='
  }
  t.throws(() => { printError(data) }, TypeError, `Throws TypeError when property 'fileName' in argument is an array`)
  data = {
    name: 'myError', code: 208, message: 'Ops', fileName: {}, reason: 'whatever', rulerLen: 10, rulerChar: '='
  }
  t.throws(() => { printError(data) }, TypeError, `Throws TypeError when property 'fileName' in argument is an object`)
  data = {
    name: 'myError', code: 208, message: 'Ops', fileName: 123, reason: 'whatever', rulerLen: 10, rulerChar: '='
  }
  t.throws(() => { printError(data) }, TypeError, `Throws TypeError when property 'fileName' in argument is a number`)

  data = {
    name: 'myError', code: 208, message: 'Ops', fileName: 'file.js', reason: [], rulerLen: 10, rulerChar: '='
  }
  t.throws(() => { printError(data) }, TypeError, `Throws TypeError when property 'reason' in argument is an array`)
  data = {
    name: 'myError', code: 208, message: 'Ops', fileName: 'file.js', reason: {}, rulerLen: 10, rulerChar: '='
  }
  t.throws(() => { printError(data) }, TypeError, `Throws TypeError when property 'reason' in argument is an object`)
  data = {
    name: 'myError', code: 208, message: 'Ops', fileName: 'file.js', reason: 123, rulerLen: 10, rulerChar: '='
  }
  t.throws(() => { printError(data) }, TypeError, `Throws TypeError when property 'reason' in argument is a number`)

  data = {
    name: 'myError', code: 208, message: 'Ops', fileName: 'file.js', reason: 'whatever', rulerLen: 10, rulerChar: '='
  }

  env = { rulerChar: '*' }
  t.throws(() => { printError(data, env) }, ReferenceError, `Throws ReferenceError when enviroment setting 'rulerLen' doesn't exist`)
  env = { rulerLen: '123', rulerChar: '*' }
  t.throws(() => { printError(data, env) }, TypeError, `Throws TypeError when enviroment setting 'rulerLen' is a string`)
  env = { rulerLen: [], rulerChar: '*' }
  t.throws(() => { printError(data, env) }, TypeError, `Throws TypeError when enviroment setting 'rulerLen' is an array`)
  env = { rulerLen: {}, rulerChar: '*' }
  t.throws(() => { printError(data, env) }, TypeError, `Throws TypeError when enviroment setting 'rulerLen' is an object`)

  env = { rulerLen: 114 }
  t.throws(() => { printError(data, env) }, ReferenceError, `Throws ReferenceError when enviroment setting 'rulerChar' doesn't exist`)
  env = { rulerLen: 114, rulerChar: 123 }
  t.throws(() => { printError(data, env) }, TypeError, `Throws TypeError when enviroment setting 'rulerChar' is a number`)
  env = { rulerLen: 114, rulerChar: [] }
  t.throws(() => { printError(data, env) }, TypeError, `Throws TypeError when enviroment setting 'rulerChar' is an array`)
  env = { rulerLen: 114, rulerChar: {} }
  t.throws(() => { printError(data, env) }, TypeError, `Throws TypeError when enviroment setting 'rulerChar' is an object`)
  t.end()
})
