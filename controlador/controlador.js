const db = require('../db.json');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;

const listProdutos = async (req, res) => {
    res.json(db.produtos);
};

const getProduto = async (req, res) => {
    const _id = req.params.id;
    const produto = db.produtos.find(produto => produto.id == _id);
    produto ? res.send(produto) : res.status(404).send({ error: 'Produto não encontrado' });
};

const createProduto = async (req, res) => {
    const dados = req.body;
    if (!dados.nome || !dados.preco) {
        return res.status(406).send({ error: 'Nome e preço devem ser informados' });
    }
    const _id = uuidv4();
    dados.id = _id;
    db.produtos.push(dados);
    try {
        await fs.writeFile('./db.json', JSON.stringify(db));
        res.status(201).send(dados); 
    } catch (err) {
        res.status(500).send({ error: 'Erro no servidor' });
    }
};

const updateProduto = async (req, res) => {
    const _id = req.params.id;
    const dados = req.body;
    const produtoIndex = db.produtos.findIndex(produto => produto.id == _id);
    if (produtoIndex === -1) {
        return res.status(404).send({ error: 'Produto não encontrado' });
    }
    db.produtos[produtoIndex] = { ...db.produtos[produtoIndex], ...dados };
    try {
        await fs.writeFile('./db.json', JSON.stringify(db));
        res.send(db.produtos[produtoIndex]);
    } catch (err) {
        return res.status(500).send({ error: 'Erro no servidor' });
    }
};

const deleteProduto = async (req, res) => {
    const _id = req.params.id;
    const produtoIndex = db.produtos.findIndex(produto => produto.id == _id);
    if (produtoIndex === -1) {
        return res.status(404).send({ error: 'Produto não encontrado' });
    }
    db.produtos.splice(produtoIndex, 1);
    try {
        await fs.writeFile('./db.json', JSON.stringify(db));
        res.status(204).send();
    } catch (err) {
        return res.status(500).send({ error: 'Erro no servidor' });
    }
};

module.exports = { listProdutos, getProduto, createProduto, updateProduto, deleteProduto };
