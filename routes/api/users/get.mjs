import User from '../../../lib/db/models/User.mjs'
export default async function getHandler (req, res, next) {
  const offset = !isNaN(Number(req.query.offset)) ? Number(req.query.offset) : 0
  const limit = !isNaN(Number(req.query.offset)) ? Number(req.query.offset) : 20
  const total = await User.countDocuments()
  const documents = await User.find()
    .skip(offset)
    .limit(limit)
    .exec()
  res._success({ data: documents, total, limit, offset })
}
