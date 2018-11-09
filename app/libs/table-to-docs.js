/** @module libs/table-to-docs */

/* eslint-disable max-len */
/**
 * @function
 * To explain how this function works I'll illustrate by showing the data structures given as arguments and the
 * data structure returned.
 *
 * FIRST ARGUMENT ('rows')
 * [
 *    [2000, 350, 45, 64, 2459],
 *    [3000, 350, 45, 96, 3491]
 * ]
 * // SECOND ARGUMENT ('keyMap')
 * [
 *    { "key": "Belopp",     "mapped": "belopp"        },
 *    { "key": "Uppl. avg",  "mapped": "uppl.avg"      },
 *    { "key": "Fakt. avg",  "mapped": "fakt.avg"      },
 *    { "key": "Ränta",      "mapped": "ränta(kr)"     },
 *    { "key": "Total",      "mapped": "betala-totalt" },
 * ]
 * // RETURNED
 * [
 *  {
 *    "belopp": 2000,
 *    "uppl.avg": 350,
 *    "fakt.avg": 45,
 *    "ränta(kr)": 64,
 *    "betala-totalt": 2459
 *  },
 *  {
 *    "belopp": 3000,
 *    "uppl.avg": 350,
 *    "fakt.avg": 45,
 *    "ränta(kr)": 96,
 *    "betala-totalt": 3491
 *  }
 * ]
 *
 * PARAMETERS:
 * in order   Type          Name    Required  Description
 * ============================================================================================================================
 * @param     {Number[[]]}  rows    yes       An array of arrays with numbers which will become the
 *                                            property values in the objects that are returned in an array.
 *
 * @param     {Object[]}    keyMap  yes       An array of objects having two properties 'key' and 'mapped'. The order
 *                                            is the objects correlates to the order of the values in each array inside
 *                                            the 'rows' argument.
 *
 * RETURNS:
 * @return {Object[]} Returns an array of objects containing the data passed in the 'rows' argument
 */
/* eslint-enable max-len */

module.exports = ({ rows, keyMap }) => {
  /**
   * @param {Object} acc
   * @param {Number} val
   * @param {Number} index
   */
  const valueToObject = (acc, val, index) => (
    {
      ...acc,
      [keyMap[index].mapped]: val
    }
  )
  /**
   * @param {Number[]} row
   */
  const rowToDoc = row => row.reduce(valueToObject, {})

  return rows.map(row => rowToDoc(row))
}

/* eslint-disable */
/*

keyMap = [
  { "key": "Belopp",     "mapped": "belopp"        },
  { "key": "Uppl. avg",  "mapped": "uppl.avg"      },
  { "key": "Fakt. avg",  "mapped": "fakt.avg"      },
  { "key": "Ränta",      "mapped": "ränta(kr)"     },
  { "key": "Total",      "mapped": "betala-totalt" },
]

rows = [
  [2000, 350, 45, 64, 2459],
  [3000, 350, 45, 96, 3491]
]

docs = [
  {
    "belopp": 2000,
    "uppl.avg": 350,
    "fakt.avg": 45,
    "ränta(kr)": 64,
    "betala-totalt": 2459
  },
  {
    "belopp": 3000,
    "uppl.avg": 350,
    "fakt.avg": 45,
    "ränta(kr)": 96,
    "betala-totalt": 3491
  }
]
















module.exports = (data, rows, keyMap) => {
  const arrayToObject = (accObj, currVal, i) => (
    {
      ...accObj,
      [keyMap[i].mapped]: currVal
    }
  )

  const docs = data.reduce(
    (accArrayOfObjects, arr) => accArrayOfObjects.concat(
      [
        arr.reduce(arrayToObject, {})
      ]
    ),
    []
  )

  return docs
}
*/
