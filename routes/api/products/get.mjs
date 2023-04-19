import Product from '../../../lib/db/models/Product.mjs'
export default async function getHandler (req, res, next) {
  const offset = !isNaN(Number(req.query.offset)) ? Number(req.query.offset) : 0
  const limit = !isNaN(Number(req.query.offset)) ? Number(req.query.offset) : 20
  const total = await Product.countDocuments()
  const documents = await Product.find()
    .skip(offset)
    .limit(limit)
    .populate('category')
    .exec()
  res._success({ data: documents, total, limit, offset })
}
