const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log("Dentro del middleware de autenticación");  // Nuevo log
  
  const { authorization } = req.headers;
  if (!authorization) {
    console.log("Sin autorización. Deteniendo...");  // Nuevo log
    return res.status(401).send({ error: 'Debe estar autenticado.' });
  }

  const token = authorization.replace('Bearer ', '');
  jwt.verify(token, 'MY_SECRET_KEY', async (err, payload) => {
    if (err) {
      console.log("Error en la verificación del token. Deteniendo...");  // Nuevo log
      return res.status(401).send({ error: 'Debe estar autenticado.' });
    }

    console.log("Token verificado. Continuando...");  // Nuevo log
    const { userId } = payload;

    req.user = userId;
    next();
  });
};
