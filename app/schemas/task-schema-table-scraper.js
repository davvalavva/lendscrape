module.exports = {
  attemptNo: { keyType: ['number'], min: 1, isInteger: true },
  maxRetries: { keyType: ['number', 'null'], min: 1, isInteger: true, default: null }, // eslint-disable-line
  creditor: { keyType: ['string'] },
  scraper: { keyType: ['function'] },
  isAsyncScraper: { keyType: ['boolean'] },
  scraperName: { keyType: ['string'] },
  payload: { keyType: ['string'] },
  targetURL: { keyType: ['string'], regExp: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/ }, // eslint-disable-line
  schema: { keyType: ['object'] },
  hdSelector: { keyType: ['string'] },
  tdSelector: { keyType: ['string'] },
  labelMap: { keyType: ['array'] },
  fieldInject: { keyType: ['object'] }
}
