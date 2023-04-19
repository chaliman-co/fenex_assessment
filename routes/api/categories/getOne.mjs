export default async function getOneHandler (req, res, next) {
  res._success(req.resolvedParams.category)
}
