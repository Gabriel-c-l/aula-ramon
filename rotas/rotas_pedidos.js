const express = require('express');
const router = express.Router();
const controladorPedidos = require('../controladorPedidos');

router.get('/', controladorPedidos.listPedidos);
router.get('/:id', controladorPedidos.getPedido);
router.post('/', controladorPedidos.createPedido);
router.put('/:id', controladorPedidos.updatePedido);
router.delete('/:id', controladorPedidos.deletePedido);

module.exports = router;
