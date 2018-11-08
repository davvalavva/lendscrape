const { test } = require('tap')
const main = require('./main')

test('main()', (t) => {
  t.same(null, null, `TODO`, { todo: true })
  t.end()
})
