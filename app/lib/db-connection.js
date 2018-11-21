const { MongoClient } = require('mongodb')
const { dbConnectionURL, dbName } = require('../config/runtime.json')

const options = { useNewUrlParser: true, loggerLevel: 'error' }
let client

async function open() {
  if (!client) client = await MongoClient.connect(dbConnectionURL, options)
  if (!client.isConnected()) await client.connect()
  return client
}

module.exports = {
  async db() {
    if (client && client.isConnected) {
      return client.db(dbName)
    }
    return (await open()).db(dbName)
  },
  async close() {
    if (client) {
      await client.close()
    }
    return true
  }
}
