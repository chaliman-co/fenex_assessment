import jsonWebToken from 'jsonwebtoken'
import { connectToDb, connection as dbConnection } from './db/db.mjs'
import config from './config.json' assert {type: "json"}
import mongoose from 'mongoose'
import { response } from 'express'
const { sign: signToken } = jsonWebToken
export function extendExpress () {
  response._sendError = function _sendError (summary, errorReport) {
    this.status((errorReport.statusCode) || 500)
    this.json({
      status: 'failed',
      reason: summary,
      errors: errorReport.errorDetails
    })
  }
  response._success = function _success (result = {}) {
    this.status(result.statusCode || 200)
    this.json({
      status: 'success',
      result
    })
  }
}

export function _404ErrorHandler (req, res, next) {
  if (!res.finished) {
    return res._sendError('item not found', new ErrorReport(404, {
      url: 'resource not found'
    }))
  }
  next()
}

export function internalServerErrorHandler (err, req, res, next) {
  console.log('internal error:', err)
  if (err.errorReport) {
    if (!res.finished) return res._sendError('intenal server error', err.errorReport)
  }
  next(err)
}

export function getAuthToken (user) {
  const payload = {
    emailAddress: user.emailAddress,
    _id: user._id
  }
  const options = {
    expiresIn: config.TOKEN_VALIDITY
  }

  const authToken = signToken(payload, config.TOKEN_SECRET, options)

  return authToken
}

export function ErrorReport (statusCode, errorDetails) {
  if (!errorDetails) {
    [errorDetails, statusCode] = [statusCode, 400]
  }
  deepAssign(this, {
    statusCode,
    errorDetails
  })
}

export function ServerError (statusCode, reportMessage, err) {
  if (!err) {
    [err, reportMessage] = [reportMessage, undefined]
  }
  if (!err) {
    [err, statusCode] = [statusCode, 500]
  }
  if (!(reportMessage === 'none')) {
    const errorReport = new ErrorReport(statusCode, {
      server: reportMessage || 'Internal server error'
    })
    err.errorReport = errorReport
  }
  return err
}

function isObject (obj) {
  return typeof obj === 'object' && !Array.isArray(obj)
}

export function deepAssign (obj, ...sources) {
  if (!sources.length) return obj
  for (const source of sources) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!obj[key]) {
          Object.assign(obj, {
            [key]: {}
          })
        }
        deepAssign(obj[key], source[key])
      } else {
        Object.assign(obj, {
          [key]: source[key]
        })
      }
    }
  }
  return obj
}

function removeFrom (obj, testValue) {
  for (let prop in obj) {
    const value = obj[prop]
    if (typeof (value) === 'object') removeFrom(value, testValue)
    else if (value === testValue) delete obj[prop]
  }
}

export function dbErrorHandler (err, req, res, next) {
  const errorDetails = {}
  if (err.name === 'ObjectParameterError') {
    const violatedField = err.message.match(/\"(.*)\"/)[1]
    return res._sendError('Validation failed', {
      [violatedField]: `${violatedField} invalid`
    })
  }
  if (err.name === 'CastError') {
    const field = err.path
    // model = err.model.modelName
    return res._sendError('item not found', new ErrorReport(404, {
      [field]: `${field} not found`
    }))
  }
  if (err instanceof mongoose.Error.ValidationError) {
    for (const errorName in err.errors) {
      const error = err.errors[errorName]
      const errorMessage = error.message
      if (error.name === 'CastError') {
        const
          field = error.path
        errorDetails[field] = `${field} invalid`
        continue
      }
      if (/^updates\./.test(errorName)) {
        Object.assign(errorDetails, JSON.parse(errorMessage))
      } else errorDetails[errorName] = errorMessage
    }
    return res._sendError('Validation failed', new ErrorReport(errorDetails))
  }
  if (err.code === 11000) { /* duplicate value for unique field */
    const violatedField = err.message.match(/index: (.*)_1/)[1]
    errorDetails[violatedField] = `${violatedField} already taken`
    return res._sendError('item already exists', new ErrorReport(409, errorDetails))
  }
  if (err.name === 'MongoError' || err.name === 'MongoNetworkError') {
    if (dbConnection.connection.readyState === 0) {
      connectToDb(process.env.DB_URL)
      console.log('\n\n told db to reconnect')
    }
    return next(new ServerError(err))
  }
  return next(err)
}
