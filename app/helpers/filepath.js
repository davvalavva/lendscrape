/** @module helpers/filepath */

/* eslint-disable max-len */
/**
 * @function
 * @todo write a description
 *
 * PARAMETERS     Type        Name        Required    Description
 * ================================================================================================================================================
 * @param         {string}    filename      yes       @todo write a description
 *
 *
 * @return {string} @todo write a description
 */
/* eslint-enable max-len */

const path = require('path')
const { OS, projectRoot } = require('../config/env.json')

const filepath = filename => (OS === 'win'
  ? `${projectRoot}${path.win32.basename(filename)}`
  : `${projectRoot}${path.posix.basename(filename)}`)

module.exports = filepath
