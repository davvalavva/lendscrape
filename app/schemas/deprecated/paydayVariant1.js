module.exports = {
  leverantörsId: { keyType: ['number'], min: 1, isInteger: true },
  belopp: { keyType: ['number'], min: 0, isInteger: true },
  'uppl.avg': { keyType: ['number'], min: 0, isInteger: true },
  'fakt.avg': { keyType: ['number'], min: 0, isInteger: true },
  'ränta(kr)': { keyType: ['number'], min: 0, isInteger: true },
  'betala-totalt': { keyType: ['number'], min: 0, isInteger: true },
  'eff.-ränta(%)': { keyType: ['number'], min: 0, isInteger: true },
  'nom.-ränta(%)': { keyType: ['number'], min: 0, isInteger: true },
  'löptid(d)': { keyType: ['number'], min: 0, isInteger: true }
}
