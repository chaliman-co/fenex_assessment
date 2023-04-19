import Category from '../../../lib/db/models/Category.mjs'
export default async function getHandler (req, res, next) {
  const documents = await Category.find()
    .exec()
  res._success(documents)
}
