import passport from 'passport'
import { ServerError, ErrorReport } from '../../utils.mjs'
import bearerStrategy from '../strategies/bearer.mjs'
passport.use(bearerStrategy)
export default function bounceUnauthenticated (req, res, next) {
  if (!(req.headers.authorization) || (req.headers.authorization.substring(0, 6).toLowerCase() !== 'bearer')) {
    res.header('WWW-Authenticate', 'Bearer')._sendError('authentication failed', new ErrorReport(401, {
      token: 'token not provided'
    }))
  } else {
    passport.authenticate('bearer', {
      session: false
    }, (err, user, info) => {
      req.user = user
      if (err) {
        if (err.token) {
          res.header('WWW-Authenticate', 'Bearer')._sendError('authentication failed', new ErrorReport(401, err))
        } else {
          next(ServerError(err))
        }
      } else if (!user) {
        res
          .header('WWW-Authenticate', 'Bearer')
          ._sendError('authentication failed', new ErrorReport(401, info))
      }
      next()
    })(req, res, next)
  }
};
