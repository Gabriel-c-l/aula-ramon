const express = require('express');
const router = express.Router();
const controlador = require('../controlador/controlador');
const validadorDeCookie = require('../middlewares/validadorDeCookie'); // Ensure it's imported correctly

router.get('/', validadorDeCookie, controlador.listProdutos);
router.get('/:id', controlador.getProduto);
router.post('/', controlador.createProduto);
router.put('/:id', controlador.updateProduto);
router.delete('/:id', controlador.deleteProduto);

module.exports = router;
