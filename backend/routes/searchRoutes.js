const express = require('express');
const router = express.Router();
const { generateToken, authenticateToken } = require('../auth/jwtHelper');

// Lógica de búsqueda aquí

module.exports = router;
