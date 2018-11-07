/* eslint-disable no-new */
const { test } = require('tap')
const AbstractError = require('./abstract-error')

test('AbstractError(message, props)', (t) => {
  let ChildError
  // [01] *****************************************************************************************
  t.throws(() => { new AbstractError('not allowed', { name: 'name' }) }, SyntaxError, `[01] Throws SyntaxError when trying to instantiate this abstract class`)

  // [02] *****************************************************************************************
  // eslint-disable-next-line no-useless-constructor
  ChildError = class extends AbstractError { constructor() { super() } }
  t.throws(() => { new ChildError() }, ReferenceError, `[02] Throws ReferenceError when calling constructor without any arguments`)

  // [03] *****************************************************************************************
  ChildError = class extends AbstractError { constructor() { super(null, { name: 'name' }) } }
  t.throws(() => { new ChildError() }, TypeError, `[03] Throws TypeError when passed null as first argument to constructor`)

  // [04] *****************************************************************************************
  ChildError = class extends AbstractError { constructor() { super([], { name: 'name' }) } }
  t.throws(() => { new ChildError() }, TypeError, `[04] Throws TypeError when passed an array as first argument to constructor`)

  // [05] *****************************************************************************************
  ChildError = class extends AbstractError { constructor() { super({}, { name: 'name' }) } }
  t.throws(() => { new ChildError() }, TypeError, `[05] Throws TypeError when passed an object as first argument to constructor`)

  // [06] *****************************************************************************************
  ChildError = class extends AbstractError { constructor() { super(() => {}, { name: 'name' }) } }
  t.throws(() => { new ChildError() }, TypeError, `[06] Throws TypeError when passed a function as first argument to constructor`)

  // [07] *****************************************************************************************
  ChildError = class extends AbstractError { constructor() { super(12, { name: 'name' }) } }
  t.throws(() => { new ChildError() }, TypeError, `[07] Throws TypeError when passed a number as first argument to constructor`)

  // [08] *****************************************************************************************
  ChildError = class extends AbstractError { constructor() { super('error') } }
  t.throws(() => { new ChildError() }, ReferenceError, `[08] Throws ReferenceError when calling constructor without 2nd argument`)

  // [09] *****************************************************************************************
  ChildError = class extends AbstractError { constructor() { super('error', null) } }
  t.throws(() => { new ChildError() }, TypeError, `[09] Throws TypeError when passed null as second argument to constructor`)

  // [10] *****************************************************************************************
  ChildError = class extends AbstractError { constructor() { super('error', []) } }
  t.throws(() => { new ChildError() }, TypeError, `[10] Throws TypeError when passed an array as second argument to constructor`)

  // [10] *****************************************************************************************
  ChildError = class extends AbstractError { constructor() { super('error', () => {}) } }
  t.throws(() => { new ChildError() }, TypeError, `[10] Throws TypeError when passed a function as second argument to constructor`)

  // [12] *****************************************************************************************
  ChildError = class extends AbstractError { constructor() { super('error', 12) } }
  t.throws(() => { new ChildError() }, TypeError, `[12] Throws TypeError when passed a number as second argument to constructor`)

  // [13] *****************************************************************************************
  ChildError = class extends AbstractError { constructor() { super('error', '12') } }
  t.throws(() => { new ChildError() }, TypeError, `[13] Throws TypeError when passed a string as second argument to constructor`)

  // [14] *****************************************************************************************
  ChildError = class extends AbstractError { constructor() { super('error', {}) } }
  t.throws(() => { new ChildError() }, ReferenceError, `[14] Throws ReferenceError when object passed as 2nd arg. to constructor doesn't have a name property`)

  // [15] *****************************************************************************************
  ChildError = class extends AbstractError { constructor() { super('error', { name: null }) } }
  t.throws(() => { new ChildError() }, TypeError, `[15] Throws TypeError when value of name property in object passed as 2nd arg. to constructor is null`)

  // [16] *****************************************************************************************
  ChildError = class extends AbstractError { constructor() { super('error', { name: 12 }) } }
  t.throws(() => { new ChildError() }, TypeError, `[16] Throws TypeError when value of name property in object passed as 2nd arg. to constructor is a number`)

  // [17] *****************************************************************************************
  ChildError = class extends AbstractError { constructor() { super('error', { name: [] }) } }
  t.throws(() => { new ChildError() }, TypeError, `[17] Throws TypeError when value of name property in object passed as 2nd arg. to constructor is an array`)

  // [18] *****************************************************************************************
  ChildError = class extends AbstractError { constructor() { super('error', { name: {} }) } }
  t.throws(() => { new ChildError() }, TypeError, `[18] Throws TypeError when value of name property in object passed as 2nd arg. to constructor is an object`)

  // [19] *****************************************************************************************
  ChildError = class extends AbstractError { constructor() { super('error', { name: () => {} }) } }
  t.throws(() => { new ChildError() }, TypeError, `[19] Throws TypeError when value of name property in object passed as 2nd arg. to constructor is a function`)

  t.end()
})
