const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const rotasProduto = require('./rotas/rotas_produto');
const rotasClientes = require('./rotas/rotas_cliente');

app.use(bodyParser.json());

app.use('/produtos', rotasProduto);
app.use('/clientes', rotasClientes);

app.listen(8000, () => {
   console.log('Servidor rodando na porta 8000');
});
