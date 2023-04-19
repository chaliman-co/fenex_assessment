export default async function updateHandler (req, res, next) {
  const category = req.resolvedParams.category
  if (req.body.name) category.name = req.body.name
  try {
    await category.save()
    res._success(category)
  } catch (err) {
    next(err)
  }
}
