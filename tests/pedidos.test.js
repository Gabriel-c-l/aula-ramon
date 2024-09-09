const request = require('supertest');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const rotasPedidos = require('../rotas/rotas_pedidos');

app.use(bodyParser.json());
app.use('/pedidos', rotasPedidos);

describe('Testes para a rota de Pedidos', () => {
    let pedidoId;

    beforeEach(() => {
        const initialDb = {
            produtos: [],
            clientes: [],
            pedidos: []
        };
        fs.writeFileSync(path.join(__dirname, '../db.json'), JSON.stringify(initialDb, null, 2));
    });

    describe('GET /pedidos', () => {
        test('Deve listar todos os pedidos', async () => {
            const response = await request(app).get('/pedidos');
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });
    });

    describe('POST /pedidos', () => {
        test('Deve criar um novo pedido', async () => {
            const newOrder = {
                cliente_id: 1,
                data_pedido: "2024-09-01",
                status: "pendente",
                itens: [
                    {
                        produto_id: 1,
                        quantidade: 1,
                        preco_unitario: 1500
                    }
                ]
            };
            const response = await request(app).post('/pedidos').send(newOrder);
            expect(response.statusCode).toBe(201);

            const pedidosResponse = await request(app).get('/pedidos');
            expect(pedidosResponse.statusCode).toBe(200);
            expect(pedidosResponse.body).toBeInstanceOf(Array);
            expect(pedidosResponse.body.length).toBe(1);
            pedidoId = pedidosResponse.body[0].id;
        });
    });

    describe('GET /pedidos/:id', () => {
        test('Deve retornar um pedido específico', async () => {
            if (!pedidoId) return;

            const response = await request(app).get(`/pedidos/${pedidoId}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('id', pedidoId);
        });
    });

    describe('PUT /pedidos/:id', () => {
        test('Deve atualizar um pedido existente', async () => {
            if (!pedidoId) return;

            const updatedOrder = {
                status: "entregue"
            };
            const response = await request(app).put(`/pedidos/${pedidoId}`).send(updatedOrder);
            expect(response.statusCode).toBe(200);

            const pedidoResponse = await request(app).get(`/pedidos/${pedidoId}`);
            expect(pedidoResponse.statusCode).toBe(200);
            expect(pedidoResponse.body).toHaveProperty('status', 'entregue');
        });
    });

    describe('DELETE /pedidos/:id', () => {
        test('Deve excluir um pedido existente', async () => {
            if (!pedidoId) return;

            const response = await request(app).delete(`/pedidos/${pedidoId}`);
            expect(response.statusCode).toBe(204);

            const pedidosResponse = await request(app).get('/pedidos');
            expect(pedidosResponse.statusCode).toBe(200);
            expect(pedidosResponse.body).toBeInstanceOf(Array);
            expect(pedidosResponse.body.length).toBe(0);
        });
    });
});
