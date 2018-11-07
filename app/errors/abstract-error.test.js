/* eslint-disable no-new */
/**
 * @file Tests for file {@link <install_folder>/errors/abstract-error.js}
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const { test } = require('tap')
const AbstractError = require('./abstract-error')
const ValidationError = require('./validation-error')
const ParseError = require('./parse-error')
const XTypeError = require('./xtype-error')
const XRangeError = require('./xrange-error')

test('AbstractError(message, fileName, errorName)', (t) => {
  class MyError1 extends AbstractError {
    /* eslint-disable no-useless-constructor */
    constructor() {
      // calling constructor without arguments should throw Error in AbstractError
      super()
    }
    /* eslint-enable no-useless-constructor */
  }
  t.throws(() => { new MyError1() }, Error, `[01] Throws Error when calling constructor of AbstractError without arguments`)

  class MyError2 extends AbstractError {
    constructor(...args) {
      const [message] = args
      // calling constructor without 2nd argument should throw Error in AbstractError
      super(message)
    }
  }
  t.throws(() => { new MyError2('error') }, Error, `[02] Throws Error when calling constructor of AbstractError without 2nd argument`)

  class MyError3 extends AbstractError {
    constructor(...args) {
      const [message, fileName] = args
      // calling constructor without 3rd argument should throw Error in AbstractError
      super(message, fileName)
    }
  }
  t.throws(() => { new MyError3('error', 'file.js') }, Error, `[03] Throws Error when calling constructor of AbstractError without 3rd argument`)

  class MyError4 extends AbstractError {
    constructor(...args) {
      const [message, fileName, errorName] = args
      // This is a valid call to constructor of AbstractError,
      // it should return an instance which class' is inherited from AbstractError
      super(message, fileName, errorName)
    }
  }
  t.type(new MyError4('error', 'file.js', 'MyError4'), AbstractError, `[04] Returns error instance where the instances class is inherited from AbstractError`)

  t.throws(() => { new MyError4(null, 'file.js', 'MyError4') }, TypeError, `[05] Throws TypeError when calling 1st arg. of AbstractError with a null value`)
  t.throws(() => { new MyError4([], 'file.js', 'MyError4') }, TypeError, `[06] Throws TypeError when calling 1st arg. of AbstractError with an Array`)
  t.throws(() => { new MyError4({}, 'file.js', 'MyError4') }, TypeError, `[07] Throws TypeError when calling 1st arg. of AbstractError with an Object`)
  t.throws(() => { new MyError4(1, 'file.js', 'MyError4') }, TypeError, `[09] Throws TypeError when calling 1st arg. of AbstractError with a number`)
  t.throws(() => { new MyError4(() => {}, 'file.js', 'MyError4') }, TypeError, `[10] Throws TypeError when calling 1st arg. of AbstractError with a function`)

  t.throws(() => { new MyError4('error', null, 'MyError4') }, TypeError, `[11] Throws TypeError when calling 2nd arg. of AbstractError with a null value`)
  t.throws(() => { new MyError4('error', [], 'MyError4') }, TypeError, `[12] Throws TypeError when calling 2nd arg. of AbstractError with an Array`)
  t.throws(() => { new MyError4('error', {}, 'MyError4') }, TypeError, `[13] Throws TypeError when calling 2nd arg. of AbstractError with an Object`)
  t.throws(() => { new MyError4('error', 1, 'MyError4') }, TypeError, `[15] Throws TypeError when calling 2nd arg. of AbstractError with a number`)
  t.throws(() => { new MyError4('error', () => {}, 'MyError4') }, TypeError, `[16] Throws TypeError when calling 2nd arg. of AbstractError with a function`)

  t.throws(() => { new MyError4('error', 'file.js', null) }, TypeError, `[17] Throws TypeError when calling 3rd arg. of AbstractError with a null value`)
  t.throws(() => { new MyError4('error', 'file.js', []) }, TypeError, `[18] Throws TypeError when calling 3rd arg. of AbstractError with an Array`)
  t.throws(() => { new MyError4('error', 'file.js', {}) }, TypeError, `[19] Throws TypeError when calling 3rd arg. of AbstractError with an Object`)
  t.throws(() => { new MyError4('error', 'file.js', 1) }, TypeError, `[21] Throws TypeError when calling 3rd arg. of AbstractError with a number`)
  t.throws(() => { new MyError4('error', 'file.js', () => {}) }, TypeError, `[22] Throws TypeError when calling 3rd arg. of AbstractError with a function`)

  t.throws(() => { new AbstractError('Illegal instantiation', 'file.js', 'MyCustomError') }, Error, `[23] Throws Error when trying to instantiate an abstract class`)

  t.type(new ValidationError('validation error', 'file.js'), AbstractError, `[24] ValidationError calls constructor of AbstractError, i.e. inherits from AbstractError`)
  t.type(new ParseError('parse error', 'file.js'), AbstractError, `[25] ParseError calls constructor of AbstractError, i.e. inherits from AbstractError`)
<<<<<<< HEAD
  t.type(new XTypeError('xtype error', 'file.js'), AbstractError, `[26] XTypeError calls constructor of AbstractError, i.e. inherits from AbstractError`)
  t.type(new XRangeError('xrange error', 'file.js'), AbstractError, `[27] XRangeError calls constructor of AbstractError, i.e. inherits from AbstractError`)
=======
<<<<<<< HEAD
  t.type(new XTypeError('xtype error', 'file.js'), AbstractError, `[26] XTypeError calls constructor of AbstractError, i.e. inherits from AbstractError`)
  t.type(new XRangeError('xrange error', 'file.js'), AbstractError, `[27] XRangeError calls constructor of AbstractError, i.e. inherits from AbstractError`)
=======
  t.type(new XTypeError('xtype error', 'file.js'), AbstractError, `[26] XTypeError calls constructor of AbstractError, i.e. inherits from AbstractError`, { todo: true })
  t.type(new XRangeError('xrange error', 'file.js'), AbstractError, `[27] XRangeError calls constructor of AbstractError, i.e. inherits from AbstractError`, { todo: true })
>>>>>>> a4cdce5c544567eddcb5d9953ef650655afdff83
>>>>>>> 95c7148e71e7a51f1be3e11087c2d0cb0075647f
  t.end()
})
