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
