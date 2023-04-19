import { compare } from 'bcrypt'
import { ErrorReport, getAuthToken } from '../../../lib/utils.mjs'
import User from '../../../lib/db/models/User.mjs'

export default async function postHandler (req, res, next) {
  const { password, emailAddress } = req.body
  const errors = {}
  if (!password) errors.password = 'password not provided'
  if (!emailAddress) errors.emailAddress = 'email not provided'
  if (Object.keys(errors).length > 0) return res._sendError('Validation Error', new ErrorReport(400, errors))
  const user = await User.findOne({ emailAddress }).exec()
  if (!user) {
    return res._sendError('Validation Error', new ErrorReport(401, {
      'emailAddress+password': 'email and password combo is incorrect'
    }))
  }
  if (!await compare(password, user.password)) {
    return res._sendError('Validation Error', new ErrorReport(401, {
      emailAddress: 'email is incorrect',
      password: 'password is incorrect'
    }))
  }
  res._success({
    token: getAuthToken(user)
  })
}
