module.exports = {
  errors: {
    names: {
      INVALID_ARG_ERR: 'InvalidArgumentError',
      STATUS_CODE_ERR: 'StatusCodeError',
      REQUEST_ERR: 'RequestError',
      URI_ERR: 'URIError',
      CRED_CFG_ERR: 'CreditorConfigurationError',
      VALIDATION_ERR: 'ValidationError',
      MAP_ERR: 'MappingError',
      TRANSFORM_DATA_ERR: 'TransformDataError'
    },
    statusCodes: {
      400: { message: 'Bad Request' },
      401: { message: 'Unauthorized' },
      403: { message: 'Forbidden' },
      404: { message: 'File not found' },
      405: { message: 'Method Not Allowed' },
      408: { message: 'Request Timeout' },
      410: { message: 'Gone' },
      412: { message: 'Precondition Failed' },
      429: { message: 'Too Many Requests' },
      500: { message: 'Internal Server Error' },
      503: { message: 'Service Unavailable' }
    }
  }
}
