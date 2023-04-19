import path from 'path'
import { ErrorReport, deepAssign } from '../../../lib/utils.mjs'

import Product from '../../../lib/db/models/Product.mjs'
export default async function createHandler (req, res, next) {
  const rawInput = req.body
  const productDetails = new Product.Fields()

  try {
    deepAssign(productDetails, rawInput)
  } catch (err) {
    const unknownField = err.message.match(/property (.+),/)[1]
    return res._sendError('unknown parameters',
      new ErrorReport(400, {
        [unknownField]: `${unknownField} is an unknown field`
      })
    )
  }
  if (req.file) productDetails.imageUrl = path.join('/images/products', req.file.filename)
  const product = new Product(productDetails)

  try {
    await product.save()
    return res._success(product)
  } catch (err) {
    return next(err)
  }
}
