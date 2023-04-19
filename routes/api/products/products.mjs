import { Router, json as jsonBodyParser } from 'express'
import path from 'path'
import multer from 'multer'
import createHandler from './create.mjs'
import deleteHandler from './delete.mjs'
import getHandler from './get.mjs'
import updateHandler from './update.mjs'
import getOneHandler from './getOne.mjs'
import Product from '../../../lib/db/models/Product.mjs'
import { ErrorReport } from '../../../lib/utils.mjs'
import { Types } from 'mongoose'
const { ObjectId } = Types
const router = new Router()
const imageStoragePath = path.resolve('public/images/products')
router.get('/', getHandler)
router.get('/:id', getOneHandler)
router.patch('/:id', multer({ dest: imageStoragePath }).single('image'), updateHandler)
router.delete('/:id', deleteHandler)
router.post('/', multer({ dest: imageStoragePath }).single('image'), createHandler)
export default router

router.param('id', async (req, res, next) => {
  let productId
  try {
    productId = new ObjectId(req.params.id)
  } catch (err) {
    return res._sendError('product not found', new ErrorReport(404, { product: 'product not found' }))
  }
  const product = await Product.findOne({ _id: productId }).populate('category').exec()
  if (!product) return res._sendError('product not found', new ErrorReport(404, { product: 'product not found' }))
  req.resolvedParams = req.resolvedParams || {}
  req.resolvedParams.product = product
  next()
})
