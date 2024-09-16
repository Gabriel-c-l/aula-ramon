const fs = require('fs');
const db = require('../db.json');
const { v4: uuidv4 } = require('uuid');

const listClientes = (req, res) => {
    res.json(db.clientes);
}

const getCliente = (req, res) => {
    const _id = req.params.id;
    const cliente = db.clientes.find(cliente => cliente.id == _id);
    cliente ? res.json(cliente) : res.status(404).send({ error: 'Cliente não encontrado' });
}

const createCliente = (req, res) => {
    const dados = req.body;
    if (!dados.nome || !dados.email || !dados.senha) {
        return res.status(406).send({ error: 'Nome, email e senha devem ser informados' });
    }
    const _id = uuidv4();
    dados.id = _id;
    db.clientes.push(dados);
    fs.writeFile('./db.json', JSON.stringify(db), (err) => {
        if (err) {
            return res.status(500).send({ error: 'Erro no servidor' });
        }
        res.status(201).send(dados);
    });
}

const updateCliente = (req, res) => {
    const _id = req.params.id;
    const dados = req.body;
    const clienteIndex = db.clientes.findIndex(cliente => cliente.id == _id);
    if (clienteIndex === -1) {
        return res.status(404).send({ error: 'Cliente não encontrado' });
    }
    db.clientes[clienteIndex] = { ...db.clientes[clienteIndex], ...dados };
    fs.writeFile('./db.json', JSON.stringify(db), (err) => {
        if (err) {
            return res.status(500).send({ error: 'Erro no servidor' });
        }
        res.send(db.clientes[clienteIndex]);
    });
}

const deleteCliente = (req, res) => {
    const _id = req.params.id;
    const clienteIndex = db.clientes.findIndex(cliente => cliente.id == _id);
    if (clienteIndex === -1) {
        return res.status(404).send({ error: 'Cliente não encontrado' });
    }
    db.clientes.splice(clienteIndex, 1);
    fs.writeFile('./db.json', JSON.stringify(db), (err) => {
        if (err) {
            return res.status(500).send({ error: 'Erro no servidor' });
        }
        res.status(204).send();
    });
}

module.exports = { listClientes, getCliente, createCliente, updateCliente, deleteCliente };
