const { test } = require('tap')
const customValMap = require('./customValMap')

test('customValMap()', (t1) => {
  const dateTimeStub = () => '2018-10-30 18:58:18 UTC+1'
  const keysVals = [
    { mappedKeyName: 'löptid (d)', value: 30 },
    { mappedKeyName: 'leverantörsId', value: 1 },
    { mappedKeyName: 'senaste kontroll', value: 'now()' },
    { mappedKeyName: 'senaste ändring', value: 'now()' }
  ]
  test('invoked with valid arguments', (t2) => {
    const wanted = {
      'löptid (d)': 30,
      leverantörsId: 1,
      'senaste kontroll': '2018-10-30 18:58:18 UTC+1',
      'senaste ändring': '2018-10-30 18:58:18 UTC+1'
    }
    t2.same(customValMap('type-1', keysVals, dateTimeStub), wanted, `returns an object`)
    t2.end()
  })
  test('invoked with invalid arguments', (t2) => {
    t2.throws(() => customValMap('jibberish', keysVals, dateTimeStub), Error, `throws an Error`)
    t2.end()
  })
  t1.end()
})
