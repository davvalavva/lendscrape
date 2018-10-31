const { ParseError } = require('./customErrors')

module.exports = (value, keepDecimals = false, decimalSep = ',') => {
  if (value == null) {
    throw new ParseError('Can\'t parse non-strings')
  }
  if (value.trim && value.trim() === '') {
    throw new ParseError('Can\'t parse empty strings or strings containing only whitespaces')
  }

  // Return the value as-is if it's already a number (also strip decimals if keepDecimals === false)
  if (typeof value === 'number') return keepDecimals ? value : Math.trunc(value)

  // build regex to strip out everything except digits, decimal point and minus sign:
  const regex = new RegExp(`[^0-9-${decimalSep}]`, ['g'])
  let parsed = value.toString() // explicitly convert to string
  parsed = parsed
    // .replace(/\((.*)\)/, '-$1') // replace bracketed values with negatives
    .replace(regex, '') // strip out any cruft
    .replace(decimalSep, '.') // make sure decimal point is standard

  parsed = parseFloat(parsed)

  return keepDecimals ? parsed : Math.trunc(parsed)
}
