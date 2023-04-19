import { Router, json as jsonBodyParser } from 'express'
import createHandler from './create.mjs'
import deleteHandler from './delete.mjs'
import getHandler from './get.mjs'
import updateHandler from './update.mjs'
import getOneHandler from './getOne.mjs'
import Category from '../../../lib/db/models/Category.mjs'
import { ErrorReport } from '../../../lib/utils.mjs'
import { Types } from 'mongoose'
const { ObjectId } = Types
const router = new Router()
router.get('/', getHandler)
router.get('/:id', getOneHandler)
router.patch('/:id', jsonBodyParser(), updateHandler)
router.delete('/:id', deleteHandler)
router.post('/', jsonBodyParser(), createHandler)
export default router

router.param('id', async (req, res, next) => {
  let categoryId
  try {
    categoryId = new ObjectId(req.params.id)
  } catch (err) {
    return res._sendError('category not found', new ErrorReport(404, { category: 'category not found' }))
  }
  const category = await Category.findOne({ _id: categoryId }).exec()
  if (!category) return res._sendError('category not found', new ErrorReport(404, { category: 'category not found' }))
  req.resolvedParams = req.resolvedParams || {}
  req.resolvedParams.category = category
  next()
})
