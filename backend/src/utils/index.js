const successRes = (res, response) => res.json({ status: 200, response });

const errorRes = (res, status, error) =>
  res.status(status).json({
    status,
    error,
  });

module.exports = {
  successRes,
  errorRes,
};
