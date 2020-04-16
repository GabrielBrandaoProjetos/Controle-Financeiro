const express = require('express')

const UserController = require('./controllers/UserController');
const CaixaController = require('./controllers/CaixaController');
const MovimentacaoController = require('./controllers/MovimentacaoController');

const routes = express.Router();

routes.post('/user', UserController.create);
routes.get('/user', UserController.list);
routes.get('/user/:user_id', UserController.listCaixas);

routes.post('/caixa/:user_id', CaixaController.create);
routes.get('/caixa', CaixaController.list);
routes.delete('/caixa/:id', CaixaController.delete);
routes.post('/caixa/:id', CaixaController.update);

routes.post('/movimentacao/:caixa_id', MovimentacaoController.create);
routes.get('/movimentacao/:caixa_id', MovimentacaoController.list)

module.exports = routes;