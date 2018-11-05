/**
 * @file start point for app
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

// TODO: Fix better handling of uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Caught unhandled exception: ${err}\n`)
})

require('./main')()
