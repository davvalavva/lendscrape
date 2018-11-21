module.exports = {
  name: { keyType: ['string'] },
  parse: { keyType: ['boolean'] },
  payload: { keyType: ['string'], allowed: ['html'] },
  scraper: {
    name: { keyType: ['string'] },
    async: { keyType: ['boolean'] },
    hdSelector: { keyType: ['string', 'null'], default: null },
    trSelector: { keyType: ['string', 'null'], default: null }
  },
  targetURL: { keyType: ['string'], regExp: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/ }, // eslint-disable-line
  fieldInject: { keyType: ['object', 'null'], default: null },
  bsonDocSchema: { keyType: ['string'], allowed: ['paydayVariant1'] },
  labelMap: { keyType: ['array'] }
}
