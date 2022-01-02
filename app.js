const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

require('dotenv/config');

const api = process.env.API_URL;

app.use(express.json());
app.use(morgan('tiny'));

app.get(`${api}/products`, (req, res) => {
  const product = {
    id: 1,
    name: 'Свеча зажигания',
    image: 'some_url',
  };
  res.send(product);
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