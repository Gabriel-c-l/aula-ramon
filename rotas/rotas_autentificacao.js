const express = require('express');
const router = express.Router();
const controlador = require('../controlador/controlador-autenticacao');


router.post('/login', controlador.login);
router.post('/logout', controlador.logout);


module.exports = router;
