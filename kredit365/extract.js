module.exports = async function extract(frame) {
  const result = await frame.evaluate(() => {
    const myElements = document.querySelectorAll('.bar')
    Array.from(myElements).forEach([])
    // return something
  })

  return result
}
