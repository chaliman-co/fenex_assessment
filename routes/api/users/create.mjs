import path from 'path'
import { ErrorReport, deepAssign } from '../../../lib/utils.mjs'

import User from '../../../lib/db/models/User.mjs'
export default async function createHandler (req, res, next) {
  const rawInput = req.body
  const userDetails = new User.Fields()

  try {
    deepAssign(userDetails, rawInput)
  } catch (err) {
    const unknownField = err.message.match(/property (.+),/)[1]
    return res._sendError('unknown parameters',
      new ErrorReport(400, {
        [unknownField]: `${unknownField} is an unknown field`
      })
    )
  }
  if (req.file) userDetails.imageUrl = path.join('/images/profile_pictures', req.file.filename)
  const user = new User(userDetails)

  try {
    await user.save()
    return res._success(user)
  } catch (err) {
    return next(err)
  }
}
