const { defaultMaxRetries } = require('../config/runtime.json')

module.exports = async function retry(_tryAgain, _halted, _collection, main) {
  const halted = [..._halted]
  let collection = [..._collection]
  let tryAgain = [..._tryAgain]
    .filter((task) => {
      if (task.attemptNo > (task.maxRetries || defaultMaxRetries)) {
        halted.push(task)
        return false
      }
      return true
    })

  tryAgain = tryAgain.map((obj) => {
    const task = { ...obj }
    task.attemptNo += 1
    return task
  })

  if (tryAgain.length > 0) {
    let documents
    ({ documents, tryAgain } = await main(tryAgain))
    collection = [..._collection, ...documents]
    await retry(tryAgain, halted, collection, main)
  }
  return { tryAgain, halted, collection }
}
