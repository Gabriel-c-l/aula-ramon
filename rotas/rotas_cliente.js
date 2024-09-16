const express = require('express');
const router = express.Router();
const controladorClientes = require('../controlador/controladorClientes');

router.get('/', controladorClientes.listClientes);
router.get('/:id', controladorClientes.getCliente);
router.post('/', controladorClientes.createCliente);
router.put('/:id', controladorClientes.updateCliente);
router.delete('/:id', controladorClientes.deleteCliente);

module.exports = router;
