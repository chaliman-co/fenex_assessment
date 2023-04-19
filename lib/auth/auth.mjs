const
  strategies = require('./strategies')
const bounceUnauthenticated = require('./guards/bounceUnauthenticated')
const bounceNonAdmin = require('./guards/bounceNonAdmin')
const bounceUnauthorised = require('./guards/bounceUnauthorised')

module.exports = {
  strategies,
  bounceUnauthenticated,
  bounceNonAdmin,
  bounceUnauthorised
}
