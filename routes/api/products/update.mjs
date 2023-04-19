
import { unlink } from 'fs/promises'
import path from 'path'
import { deepAssign, ErrorReport } from '../../../lib/utils.mjs'
import Product from '../../../lib/db/models/Product.mjs'
const imageStoragePath = path.resolve('public/images/products')
export default async function updateHandler (req, res, next) {
  const product = req.resolvedParams.product
  const update = new Product.Fields()
  try {
    deepAssign(update, req.body)
  } catch (err) {
    const unknownField = err.message.match(/property (.+),/)[1]
    return res._sendError('unknown parameters',
      new ErrorReport(400, {
        [unknownField]: `${unknownField} is an unknown field`
      })
    )
  }
  let oldImageName
  if (req.file) {
    update.imageUrl = path.join('/images/products', req.file.filename)
    oldImageName = path.basename(product.imageUrl)
  }
  for (const field in update) if (update[field]) product[field] = update[field]
  try {
    await product.save()
    if (req.file) unlink(path.resolve(imageStoragePath, oldImageName)) // delete old image if image was changed
    res._success(product)
  } catch (err) {
    next(err)
  }
}
