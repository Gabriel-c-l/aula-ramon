require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const rotasProduto = require('./rotas/rotas_produto');
const rotasClientes = require('./rotas/rotas_cliente');
const rotasAuth = require('./rotas/rotas_autentificacao');
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')

const swaggerDocument = YAML.load('./docs/documentacao.yaml')

app.use(bodyParser.json());

app.use('/produtos', rotasProduto);
app.use('/clientes', rotasClientes);
app.use('/auth', rotasAuth);

app.use('/api-docks', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.listen(8000, () => {
   console.log('Servidor rodando na porta 8000');
});
 