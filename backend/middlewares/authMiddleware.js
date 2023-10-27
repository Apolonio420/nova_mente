const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({ error: 'Debe estar autenticado.' });
  }

  const token = authorization.replace('Bearer ', '');
  jwt.verify(token, 'MY_SECRET_KEY', async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: 'Debe estar autenticado.' });
    }

    const { userId } = payload;

    req.user = userId;
    next();
  });
};
