import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import 'dotenv/config';
import { Product } from './models/product.js';

const app = express();
const api = process.env.API_URL;

app.use(express.json());
app.use(morgan('tiny'));

app.get(`${api}/products`, async (req, res) => {
  const productList = await Product.find();
  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

app.post(`${api}/products`, (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });
  product.save()
    .then(createdProduct => {
      res.status(200).json(createdProduct);
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});

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