// TODO: Fix better handling of uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Caught unhandled exception: ${err}\n`)
})

require('./main')
