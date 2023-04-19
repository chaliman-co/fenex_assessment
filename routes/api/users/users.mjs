import { Router } from 'express'
import { Types } from 'mongoose'
import multer from 'multer'
import path from 'path'
import createHandler from './create.mjs'
import getHandler from './get.mjs'
import getOneHandler from './getOne.mjs'
import bounceUnauthenticated from '../../../lib/auth/guards/bounceUnauthenticated.mjs'
import bounceUnauthorized from '../../../lib/auth/guards/bounceUnauthorised.mjs'
import User from '../../../lib/db/models/User.mjs'
import { ErrorReport } from '../../../lib/utils.mjs'
const imageStoragePath = path.resolve('public/images/profile_pictures')
const { ObjectId } = Types
const router = new Router()
router.get('/:id', bounceUnauthenticated, bounceUnauthorized({ admin: true, owner: true }), getOneHandler) // admin and owner can access this route
router.get('/', getHandler)
router.post('/', multer({ dest: imageStoragePath }).single('image'), createHandler)

export default router
router.param('id', async (req, res, next) => {
  let userId
  try {
    userId = new ObjectId(req.params.id)
  } catch (err) {
    return res._sendError('user not found', new ErrorReport(404, { user: 'user not found' }))
  }
  const user = await User.findById(userId).exec()
  if (!user) return res._sendError('user not found', new ErrorReport(404, { user: 'user not found' }))
  req.resolvedParams = req.resolvedParams || {}
  req.resolvedParams.user = user
  req.resolvedParams.ownerId = user._id
  next()
})
