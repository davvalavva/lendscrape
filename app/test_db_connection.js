const connection = require('./lib/db-connection.js');

(async () => {
  try {
    const db = await connection.db()
    const collection = db.collection('abc')
    const item = await collection.findOne({})
    console.log(item)
    // console.log(await collection.find().toArray())
    await connection.close()
  } catch (e) {
    console.log(e.message)
  }
})()
