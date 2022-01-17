export const errorHandler = (err, req, res, next) => {
  if (err) {
    return res.status(err.status).json(err);
  }
}