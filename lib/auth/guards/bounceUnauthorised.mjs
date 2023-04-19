import { ErrorReport } from '../../utils.mjs'
export default canBe => {
  return function bounceUnauthorised (req, res, next) {
    let isAllowed = false
    if (canBe.owner && req.user._id.equals(req.resolvedParams.ownerId)) isAllowed = true // the current user is allowed to access this resource
    if (canBe.admin && req.user.role === 'admin') isAllowed = true // admin is allowed to access this resource
    if (!isAllowed) {
      return res._sendError('authentication failed', new ErrorReport(401, {
        auth: 'user not authorized'
      }))
    }
    return next()
  }
}
