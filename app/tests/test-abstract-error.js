/* eslint-disable no-new */
const { test } = require('tap')
const AbstractError = require('../errors/abstract-error')

test('AbstractError(message)', (t) => {
  let ChildError
  // [01] *****************************************************************************************
  t.throws(() => { new AbstractError('not allowed') }, SyntaxError, `[01] Throws SyntaxError when trying to instantiate this abstract class`)

  // [02] *****************************************************************************************
  // eslint-disable-next-line no-useless-constructor
  ChildError = class extends AbstractError { constructor() { super() } }
  t.throws(() => { new ChildError() }, ReferenceError, `[02] Throws ReferenceError when no argument is passed to constructor`)

  // [03] *****************************************************************************************
  ChildError = class extends AbstractError { constructor() { super(null) } }
  t.throws(() => { new ChildError() }, TypeError, `[03] Throws TypeError when null is passed to constructor`)

  // [04] *****************************************************************************************
  ChildError = class extends AbstractError { constructor() { super([]) } }
  t.throws(() => { new ChildError() }, TypeError, `[04] Throws TypeError when an array is passed to constructor`)

  // [05] *****************************************************************************************
  ChildError = class extends AbstractError { constructor() { super({}) } }
  t.throws(() => { new ChildError() }, TypeError, `[05] Throws TypeError when an object is passed to constructor`)

  // [06] *****************************************************************************************
  ChildError = class extends AbstractError { constructor() { super(() => {}) } }
  t.throws(() => { new ChildError() }, TypeError, `[06] Throws TypeError when a function is passed to constructor`)

  // [07] *****************************************************************************************
  ChildError = class extends AbstractError { constructor() { super(12) } }
  t.throws(() => { new ChildError() }, TypeError, `[07] Throws TypeError when a number is passed to constructor`)

  // [08] *****************************************************************************************
  ChildError = class extends AbstractError { constructor() { super(12, { debug: 1, log: false }) } }
  t.throws(() => { new ChildError() }, TypeError, `[08] Throws TypeError (and should output error to terminal but no log error)`)

  // [09] *****************************************************************************************
  ChildError = class extends AbstractError { constructor() { super(12, { debug: 1, log: true }) } }
  t.throws(() => { new ChildError() }, TypeError, `Throws TypeError (and should output error to terminal and log error)`)

  // [10] *****************************************************************************************
  ChildError = class extends AbstractError { constructor() { super(12, { debug: 0, log: true }) } }
  t.throws(() => { new ChildError() }, TypeError, `Throws TypeError (and should log error but not output error to terminal)`)

  t.end()
})
