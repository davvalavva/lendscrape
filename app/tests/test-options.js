const { test } = require('tap')
const options = require('../main/options')
let actual
let expected
test('options()', (t) => {
  t.type(a, b, `options() should return an object`)
  t.throws(() => { options() }, ReferenceError, `[01] Throws ReferenceError when no argument given`)

  t.end()
})
