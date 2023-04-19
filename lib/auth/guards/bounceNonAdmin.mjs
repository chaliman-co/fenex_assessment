import { ErrorReport } from '../../utils.mjs'
export default function bounceNonAdmin (req, res, next) {
  if (req.user.role !== 'admin') {
    return res._sendError(
      'authentication failed',
      new ErrorReport(401, {
        auth: 'user not authorized'
      })
    )
  }
  next()
};
