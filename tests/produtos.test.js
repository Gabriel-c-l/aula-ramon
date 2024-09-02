const request = require('supertest');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const rotasProduto = require('../rotas/rotas_produto');
const fs = require('fs');
const path = require('path');

app.use(bodyParser.json());
app.use('/produtos', rotasProduto);

describe('Testes para a rota de Produtos', () => {
    let produtoId;

    beforeEach(() => {
        const initialDb = {
            produtos: [],
            clientes: [],
            pedidos: []
        };
        fs.writeFileSync(path.join(__dirname, '../db.json'), JSON.stringify(initialDb, null, 2));
    });

    describe('GET /produtos', () => {
        test('Deve listar todos os produtos', async () => {
            const response = await request(app).get('/produtos');
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });
    });

    describe('POST /produtos', () => {
        test('Deve criar um novo produto', async () => {
            const newProduct = {
                nome: "Novo Produto",
                descricao: "Descrição do novo produto",
                preco: 100,
                imagem: "novo_produto.jpg"
            };
            const response = await request(app).post('/produtos').send(newProduct);
            expect(response.statusCode).toBe(204); 

            const produtosResponse = await request(app).get('/produtos');
            expect(produtosResponse.statusCode).toBe(200);
            expect(produtosResponse.body).toBeInstanceOf(Array);
            expect(produtosResponse.body.length).toBe(1);
            produtoId = produtosResponse.body[0].id;
        });
    });

    describe('GET /produtos/:id', () => {
        test('Deve retornar um produto específico', async () => {
            if (!produtoId) return; 

            const response = await request(app).get(`/produtos/${produtoId}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('id', produtoId);
        });
    });

    describe('PUT /produtos/:id', () => {
        test('Deve atualizar um produto existente', async () => {
            if (!produtoId) return;

            const updatedProduct = {
                nome: "Produto Atualizado",
                descricao: "Descrição atualizada",
                preco: 150
            };
            const response = await request(app).put(`/produtos/${produtoId}`).send(updatedProduct);
            expect(response.statusCode).toBe(200);

            const produtoResponse = await request(app).get(`/produtos/${produtoId}`);
            expect(produtoResponse.statusCode).toBe(200);
            expect(produtoResponse.body).toHaveProperty('nome', 'Produto Atualizado');
        });
    });

    describe('DELETE /produtos/:id', () => {
        test('Deve excluir um produto existente', async () => {
            if (!produtoId) return;

            const response = await request(app).delete(`/produtos/${produtoId}`);
            expect(response.statusCode).toBe(204);
            
            const produtosResponse = await request(app).get('/produtos');
            expect(produtosResponse.statusCode).toBe(200);
            expect(produtosResponse.body).toBeInstanceOf(Array);
            expect(produtosResponse.body.length).toBe(0);
        });
    });
});
