import path from 'path'
import { ErrorReport, deepAssign } from '../../../lib/utils.mjs'

import Category from '../../../lib/db/models/Category.mjs'
export default async function createHandler (req, res, next) {
  const rawInput = req.body
  const categoryDetails = new Category.Fields()

  try {
    deepAssign(categoryDetails, rawInput)
  } catch (err) {
    const unknownField = err.message.match(/property (.+),/)[1]
    return res._sendError('unknown parameters',
      new ErrorReport(400, {
        [unknownField]: `${unknownField} is an unknown field`
      })
    )
  }
  const category = new Category(categoryDetails)

  try {
    await category.save()
    return res._success(category)
  } catch (err) {
    return next(err)
  }
}
