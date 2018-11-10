const tableToDocs = require('./table-to-docs')
const keyMap = JSON.parse(`
[
  { "key": "Belopp",     "mapped": "belopp"        },
  { "key": "Uppl. avg",  "mapped": "uppl.avg"      },
  { "key": "Fakt. avg",  "mapped": "fakt.avg"      },
  { "key": "Ränta",      "mapped": "ränta(kr)"     },
  { "key": "Total",      "mapped": "betala-totalt" },
  { "key": "Eff. ränta", "mapped": "eff.-ränta(%)" },
  { "key": "Nom. ränta", "mapped": "nom.-ränta(%)" }
]`)

const rows = JSON.parse(`[
  [2000, 350, 45, 64, 2459, 1135, 39],
  [3000, 350, 45, 96, 3491, 532,  39]
]`)

/*
const expected = JSON.parse(`[
  {
    "belopp":        2000,
    "uppl.avg":      350,
    "fakt.avg":      45,
    "ränta(kr)":     64,
    "betala-totalt": 2459,
    "eff.-ränta(%)": 1135,
    "nom.-ränta(%)": 39
  },
  {
    "belopp":        3000,
    "uppl.avg":      350,
    "fakt.avg":      45,
    "ränta(kr)":     96,
    "betala-totalt": 3491,
    "eff.-ränta(%)": 532,
    "nom.-ränta(%)": 39
  }
]`)
*/

const data = { rows, keyMap }

const x = tableToDocs(data)

console.log(JSON.stringify(x, null, 4))
