const bs = require('browser-sync').create()

const root = process.argv[2]
  ? `server/www/${process.argv[2]}/`
  : `server/www/site1/`

bs.init({ server: root, open: false, files: 'server/www/site1/*.html' })
