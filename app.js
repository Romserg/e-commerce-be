import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';
import { router as productsRoutes } from './routes/products.js';
import { router as categoriesRoutes } from './routes/categories.js';
import { router as usersRoutes } from './routes/users.js';
import { router as ordersRoutes } from './routes/orders.js';
import { authJwt } from './helpers/jwt.js';
import { errorHandler } from './helpers/error-handler.js';

const app = express();
const api = process.env.API_URL;
const __dirname = new URL('.', import.meta.url).pathname.slice(1);

//Middleware
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

//Routes
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

//Database
mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log('DB connected');
  })
  .catch(err => {
    console.log(err);
  });

//Server
app.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});