const { test } = require('tap')
const validType = require('./validType')

test('validType()', (t) => {
  t.same(null, null, `TODO`, { todo: true })
  t.end()
})
