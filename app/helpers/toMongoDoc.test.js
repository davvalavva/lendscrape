const { test } = require('tap')
const toMongoDoc = require('./toMongoDoc')

const mappings = {
  scraped: [
    { mapped: 'belopp', key: 'Belopp' },
    { mapped: 'uppl.avg', key: 'Uppl. avg' },
    { mapped: 'fakt.avg', key: 'Fakt. avg' },
    { mapped: 'ränta (kr)', key: 'Ränta' },
    { mapped: 'betala totalt', key: 'Total' },
    { mapped: 'eff. ränta (%)', key: 'Eff. ränta' },
    { mapped: 'nom. ränta (%)', key: 'Nom. ränta' }
  ],
  manual: [
    { key: 'löptid (d)', value: 30 },
    { key: 'leverantörsId', value: 1 }
  ]
}
const tableData = [[2000, 350, 45, 64, 2459, 1135, 39], [3000, 350, 45, 96, 3491, 532, 39]]
const wanted = [
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
const found = toMongoDoc(tableData, mappings)

test('toMongoDoc(data, mappings)', (t) => {
  t.same(found, wanted, `returns an array of objects (documents)`)
  t.end()
})
