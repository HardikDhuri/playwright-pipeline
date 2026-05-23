import jsonServer = require('json-server');
import * as path from 'node:path';
import {
  cartPage,
  checkoutStepOnePage,
  checkoutStepTwoPage,
  inventoryPage,
  loginPage,
} from './pages';

const host = '127.0.0.1';
const port = Number(process.env.MOCK_PORT || 3000);
const apiPath = path.resolve(__dirname, 'api', 'db.json');
const publicPath = path.resolve(__dirname, 'public');

const server = jsonServer.create();
const router = jsonServer.router(apiPath);
const middlewares = jsonServer.defaults({ static: publicPath });

server.use(middlewares);
server.use('/api', router);

server.get('/healthz', (_request, response) => {
  response.status(200).type('text/plain').send('ok');
});

server.get('/', (_request, response) => {
  response.type('html').send(loginPage());
});

server.get('/inventory.html', (_request, response) => {
  response.type('html').send(inventoryPage());
});

server.get('/cart.html', (_request, response) => {
  response.type('html').send(cartPage());
});

server.get('/checkout-step-one.html', (_request, response) => {
  response.type('html').send(checkoutStepOnePage());
});

server.get('/checkout-step-two.html', (_request, response) => {
  response.type('html').send(checkoutStepTwoPage());
});

server.listen(port, host, () => {
  console.log(`Mock app listening on http://${host}:${port}`);
});
