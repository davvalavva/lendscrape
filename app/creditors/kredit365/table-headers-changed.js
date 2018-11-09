/**
 * Verifies that data headers haven't beens changed in target
 *
 * @param {string[]} headers The headers scraped from the web page
 * @param {object[]} keyMap An array with objects mapping headernames from web page
 * to corresponding keynames for the documents in database
 * @return {boolean} Returns true if headers haven't changed, false otherwise
 */
module.exports = (headers, keyMap) => {
  const clean = str => str.trim().toLowerCase()
  if (!headers.every(
    (element, i) => clean(element) === clean(keyMap[i].key)
  )) {
    return true
  }
  return false
}
