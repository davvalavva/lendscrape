const { test } = require('tap')
/*
const validateMongoDoc = require('./validateMongoDoc')
const schemas = require('../schemas.json')
const { ValidationError } = require('./customErrors')

test('validateMongoDoc() invoked with valid arguments', (t) => {
  const schema = schemas['type-1']
  const mongoDocs = [
    {
      belopp: 2000,
      'uppl.avg': 350,
      'fakt.avg': 45,
      'ränta (kr)': 64,
      'betala totalt': 2459,
      'eff. ränta (%)': 1135,
      'nom. ränta (%)': 39,
      'löptid (d)': 30,
      leverantörsId: 1
    },
    {
      belopp: 3000,
      'uppl.avg': 350,
      'fakt.avg': 45,
      'ränta (kr)': 96,
      'betala totalt': 3491,
      'eff. ränta (%)': 532,
      'nom. ränta (%)': 39,
      'löptid (d)': 30,
      leverantörsId: 1
    }
  ]
  const found = validateMongoDoc(mongoDocs, schema)
  t.type(found, 'boolean', `validateMongoDoc() returns a Boolean`)
  t.same(found, true, `validateMongoDoc() returns TRUE`)
  mongoDocs[2] = {
    belopp: 4000,
    'uppl.avg': 350,
    faktureras: 45, // <-- Finns inte i schema, endast keys i schema får vara med
    'ränta (kr)': 96,
    'betala totalt': 3491,
    'eff. ränta (%)': 532,
    'nom. ränta (%)': 39,
    'löptid (d)': 30,
    leverantörsId: 1
  }
  t.throws(() => validateMongoDoc(mongoDocs, schema), ValidationError)
  mongoDocs[2] = {
    belopp: 4000,
    'uppl.avg': 350,
    'fakt.avg': 45,
    'ränta (kr)': "96", // <-- Ogiltig typ, måste vara heltal (Number)
    'betala totalt': 3491,
    'eff. ränta (%)': 532,
    'nom. ränta (%)': 39,
    'löptid (d)': 30,
    leverantörsId: 1
  }

  t.end()
})
*/
