const successRes = (res, response) => res.json({ status: 200, response });

const errorRes = (res, status, error) =>
  res.status(status).json({
    status,
    error,
  });

const isEditable = property => ['firstName', 'lastName', 'email', 'password'].includes(property);

module.exports = {
  successRes,
  errorRes,
  isEditable,
};
