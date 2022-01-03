import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import 'dotenv/config';
import { router as productsRoutes } from './routes/products.js';
import { router as categoriesRoutes } from './routes/categories.js';
import { router as usersRoutes } from './routes/users.js';
import { router as ordersRoutes } from './routes/orders.js';

const app = express();
const api = process.env.API_URL;

//Middleware
app.use(express.json());
app.use(morgan('tiny'));

//Routes
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log('DB connected');
  })
  .catch(e => {
    console.log(e);
  });

app.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});