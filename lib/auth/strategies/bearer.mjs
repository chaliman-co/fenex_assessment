import passport from 'passport'
import httpBearer from 'passport-http-bearer'
import jsonWebToken from 'jsonwebtoken'
import User from '../../db/models/User.mjs'
import config from '../../config.json' assert {type: "json"}
const { decode, verify } = jsonWebToken
const BearerStrategy = httpBearer.Strategy
export default new BearerStrategy(async (token, done) => {
  try {
    var tokenDetails = decode(token)
  } catch (err) {
    return done({
      token: 'invalid token'
    })
  }
  if (!(tokenDetails && tokenDetails.emailAddress)) {
    return done({
      token: 'invalid token'
    })
  }
  const user = await User.findOne({
    emailAddress: tokenDetails.emailAddress
  }).exec()

  if (!user) {
    return done({
      token: 'unrecognized token'
    })
  }
  verify(token, String(config.TOKEN_SECRET), {
    maxAge: config.TOKEN_VALIDITY
  }, (err, tokenDetails) => {
    if (err) {
      return done({
        token: err.message
      })
    }
    return done(null, user)
  })
})
