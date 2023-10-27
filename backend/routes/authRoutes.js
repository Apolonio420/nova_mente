const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();
    const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
    res.send({ token });
  } catch (error) {
    return res.status(422).send(error.message);
  }
});

// Inicio de sesión del usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).send({ error: 'Debe proporcionar correo electrónico y contraseña' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).send({ error: 'Correo electrónico o contraseña no válidos' });
  }

  try {
    await bcrypt.compare(password, user.password);
    const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
    res.send({ token });
  } catch (err) {
    return res.status(422).send({ error: 'Correo electrónico o contraseña no válidos' });
  }
});

module.exports = router;
