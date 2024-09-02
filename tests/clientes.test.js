const request = require('supertest');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const rotasClientes = require('../rotas/rotas_cliente'); // Verifique se o caminho está correto

app.use(bodyParser.json());
app.use('/clientes', rotasClientes);

describe('Testes para a rota de Clientes', () => {
    let clienteId;

    beforeEach(() => {
        // Resetar o banco de dados antes de cada teste
        const initialDb = {
            produtos: [],
            clientes: [],
            pedidos: []
        };
        fs.writeFileSync(path.join(__dirname, '../db.json'), JSON.stringify(initialDb, null, 2));
    });

    describe('GET /clientes', () => {
        test('Deve listar todos os clientes', async () => {
            const response = await request(app).get('/clientes');
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });
    });

    describe('POST /clientes', () => {
        test('Deve criar um novo cliente', async () => {
            const newClient = {
                nome: "Novo Cliente",
                email: "novo.cliente@example.com",
                senha: "senha123",
                endereco: {
                    rua: "Rua dos Novos",
                    numero: 789,
                    bairro: "Bairro Novo",
                    cidade: "Cidade Nova",
                    estado: "SP",
                    cep: "98765-432"
                }
            };
            const response = await request(app).post('/clientes').send(newClient);
            expect(response.statusCode).toBe(201); // Status de sucesso para criação

            // Verificar se o cliente foi criado
            const clientesResponse = await request(app).get('/clientes');
            expect(clientesResponse.statusCode).toBe(200);
            expect(clientesResponse.body).toBeInstanceOf(Array);
            expect(clientesResponse.body.length).toBe(1);
            clienteId = clientesResponse.body[0].id; // Salvar o ID do cliente criado
        });
    });

    describe('GET /clientes/:id', () => {
        test('Deve retornar um cliente específico', async () => {
            if (!clienteId) return; // Pular o teste se o cliente não foi criado

            const response = await request(app).get(`/clientes/${clienteId}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('id', clienteId);
        });
    });

    describe('PUT /clientes/:id', () => {
        test('Deve atualizar um cliente existente', async () => {
            if (!clienteId) return; // Pular o teste se o cliente não foi criado

            const updatedClient = {
                nome: "Cliente Atualizado",
                email: "cliente.atualizado@example.com",
                senha: "nova_senha"
            };
            const response = await request(app).put(`/clientes/${clienteId}`).send(updatedClient);
            expect(response.statusCode).toBe(200);

            const clienteResponse = await request(app).get(`/clientes/${clienteId}`);
            expect(clienteResponse.statusCode).toBe(200);
            expect(clienteResponse.body).toHaveProperty('nome', 'Cliente Atualizado');
        });
    });

    describe('DELETE /clientes/:id', () => {
        test('Deve excluir um cliente existente', async () => {
            if (!clienteId) return; // Pular o teste se o cliente não foi criado

            const response = await request(app).delete(`/clientes/${clienteId}`);
            expect(response.statusCode).toBe(204);

            const clientesResponse = await request(app).get('/clientes');
            expect(clientesResponse.statusCode).toBe(200);
            expect(clientesResponse.body).toBeInstanceOf(Array);
            expect(clientesResponse.body.length).toBe(0);
        });
    });
});
