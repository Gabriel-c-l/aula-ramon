const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, './db.json');
const db = require('./db.json');
const { v4: uuidv4 } = require('uuid');

const listPedidos = (req, res) => {
    res.json(db.pedidos);
};

const getPedido = (req, res) => {
    const _id = req.params.id;
    const pedido = db.pedidos.find(pedido => pedido.id == _id);
    pedido ? res.json(pedido) : res.status(404).send({ error: 'Pedido não encontrado' });
};

const createPedido = (req, res) => {
    const dados = req.body;
    if (!dados.cliente_id || !dados.itens || !Array.isArray(dados.itens)) {
        return res.status(406).send({ error: 'Cliente ID e itens devem ser informados' });
    }
    const _id = uuidv4();
    dados.id = _id;
    db.pedidos.push(dados);
    fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
        if (err) {
            return res.status(500).send({ error: 'Erro no servidor' });
        }
        res.status(201).send(dados);
    });
};

const updatePedido = (req, res) => {
    const _id = req.params.id;
    const dados = req.body;
    const pedidoIndex = db.pedidos.findIndex(pedido => pedido.id == _id);
    if (pedidoIndex === -1) {
        return res.status(404).send({ error: 'Pedido não encontrado' });
    }
    db.pedidos[pedidoIndex] = { ...db.pedidos[pedidoIndex], ...dados };
    fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
        if (err) {
            return res.status(500).send({ error: 'Erro no servidor' });
        }
        res.send(db.pedidos[pedidoIndex]);
    });
};

const deletePedido = (req, res) => {
    const _id = req.params.id;
    const pedidoIndex = db.pedidos.findIndex(pedido => pedido.id == _id);
    if (pedidoIndex === -1) {
        return res.status(404).send({ error: 'Pedido não encontrado' });
    }
    db.pedidos.splice(pedidoIndex, 1);
    fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
        if (err) {
            return res.status(500).send({ error: 'Erro no servidor' });
        }
        res.status(204).send();
    });
};

module.exports = { listPedidos, getPedido, createPedido, updatePedido, deletePedido };
