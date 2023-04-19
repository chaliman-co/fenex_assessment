import Category from '../../../lib/db/models/Category.mjs'

export default async function deleteHandler (req, res, next) {
  await Category.findByIdAndRemove(req.resolvedParams.category._id)
  res._success(req.resolvedParams.category)
}
