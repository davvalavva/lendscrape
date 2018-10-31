const { test } = require('tap')
const manualVals = require('./manualVals')

test('manualVals()', (t1) => {
  test('invoked with valid arguments', (t2) => {
    const dateTimeStub = () => '2018-10-30 18:58:18 UTC+1'
    const keysVals = [
      { key: 'löptid (d)', value: 30 },
      { key: 'leverantörsId', value: 1 },
      { key: 'senaste kontroll', value: 'now()' },
      { key: 'senaste ändring', value: 'now()' }
    ]
    const wanted = {
      'löptid (d)': 30,
      leverantörsId: 1,
      'senaste kontroll': '2018-10-30 18:58:18 UTC+1',
      'senaste ändring': '2018-10-30 18:58:18 UTC+1'
    }
    const found = manualVals(keysVals, dateTimeStub)
    t2.same(found, wanted, `manualVals() returns an object`)
    t2.end()
  })
  /*
  test('invoked with invalid arguments', (t2) => {
    t2.throws(() => manualVals(keysVals, dateTimeStub), Error, `throws an Error`)
    t2.end()
  })
  */
  t1.end()
})
