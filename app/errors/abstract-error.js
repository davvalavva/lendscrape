const ExtendableError = require('es6-error')
const typeName = require('type-name')
const path = require('path')
const { OS, projectRoot: dir } = require('../config/env.json')

const fName = OS === 'win' ? path.win32.basename(__filename) : path.posix.basename(__filename)
const filepath = `${dir}${fName}`

/*
 * An error representing a failure of some kind of parsing going on.
 *
 * The inherited ExtendableError class just adds the stack property
 * to the error object via Error class' static captureStackTrace() method.
 *
 * Arguments:
 *    message         a non-empty and non-whitespace-only string with an error message
 *    props           An object with additional properties of error object.
 *                    Requires having a property 'name' with a string value that isn't an
 *                    empty string or a string with only white spaces
 */
class AbstractError extends ExtendableError {
  constructor(message, props) {
    super(message)
    const thrownStr = `Thrown in file: '${filepath}'`
    const constrName = 'AbstractError'
    let changeName
    let err

    if (this.constructor === AbstractError) {
      err = new SyntaxError(`Trying to instantiate an abstract class. Class name: '${constrName}'. ${thrownStr}`)
      changeName = constrName
    } else if (message === undefined) {
      err = new ReferenceError(
        `Missing required 1st argument 'message' for constructor of class '${constrName}'. ${thrownStr}`
      )
      // So that this.name reflects that the error was thrown by this class and not the child class.
      changeName = constrName
    } else if (props === undefined) {
      err = new ReferenceError(
        `Missing required 2nd argument 'props' for constructor of class '${constrName}'. ${thrownStr}`
      )
      changeName = constrName
    } else if (typeName(message) !== 'string') {
      err = new TypeError(
        `First argument 'message' must be a string when calling constructor of class '${constrName}'. Found type '${typeName(message)}'. ${thrownStr}`
      )
    } else if (message.trim() === '') {
      err = new TypeError(
        `String given as 1st argument 'message' must not be empty or have only whitespace(s) when calling constructor of class '${constrName}'. ${thrownStr}`
      )
    } else if (typeName(props) !== 'Object') {
      err = new TypeError(
        `Second argument 'props' passed to constructor for class '${constrName}' must be an object. Found type '${typeName(props)}'. ${thrownStr}`
      )
      changeName = constrName
    } else if (props.name === undefined) {
      err = new ReferenceError(
        `Missing property 'name' in object given as 2nd argument to constructor for class '${constrName}'. ${thrownStr}`
      )
      changeName = constrName
    } else if (typeName(props.name) !== 'string') {
      err = new TypeError(
        `Wrong type of property 'name' (found type '${typeName(props.name)}') in object given as 2nd argument to constructor for class '${constrName}'. ${thrownStr}`
      )
      changeName = constrName
    } else if (props.name.trim() === '') {
      err = new TypeError(
        `String must not be empty or only whitespace(s) for property 'name' in object given as 2nd argument to constructor for class '${constrName}'. ${thrownStr}`
      )
      changeName = constrName
    }

    this.name = changeName || props.name
    if (err) {
      throw err
    }
  }
}

module.exports = AbstractError
