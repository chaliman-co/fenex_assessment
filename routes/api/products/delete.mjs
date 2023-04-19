import path from 'path'
import { unlink } from 'fs/promises'
import Product from '../../../lib/db/models/Product.mjs'

const imageStoragePath = path.resolve('public/images/products')
export default async function deleteHandler (req, res, next) {
  const product = req.resolvedParams.product
  await Product.findByIdAndRemove(product._id)
  unlink(path.resolve(imageStoragePath, path.basename(product.imageUrl)))
  res._success(req.resolvedParams.product)
}
