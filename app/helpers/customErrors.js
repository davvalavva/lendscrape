/**
 * @file Custom Error classes
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson <david.jonsson@pm.me>
 */

class ValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ValidationError'
  }
}

class ParseError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ParseError'
  }
}

module.exports = {
  ValidationError,
  ParseError
}
