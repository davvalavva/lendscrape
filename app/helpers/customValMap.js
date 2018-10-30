const cValMapT1 = (keys, dateTime) => keys.map(
  (obj) => {
    const val = obj.value === 'now()' ? dateTime({ showTimeZone: true }) : obj.value
    return { [obj.mappedKeyName]: val }
  }
).reduce((accObj, currObj) => ({ ...accObj, ...currObj }), {})

module.exports = (type, keys, dateTime) => {
  switch (type) {
    case 'type-1':
      return cValMapT1(keys, dateTime)
    default:
      throw new Error('Invalid argument for customValMap()')
  }
}
