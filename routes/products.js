import express from 'express';
import { Product } from '../models/product.js';
import { Category } from '../models/category.js';

const router = express.Router();

router.get(`/`, async (req, res) => {
  const productList = await Product.find().populate('category');
  if (!productList) {
    return res.status(500).json({ success: false });
  }
  return res.status(200).send(productList);
});

router.get(`/:id`, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      res.status(500).json({ success: false });
    }
    res.status(200).send(product);
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }

});

router.post(`/`, async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category)
      return res.status(400).send('Invalid category');
  } catch (err) {
    return res.status(500).send(err);
  }

  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  const createdProduct = await product.save();
  if (!createdProduct)
    return res.status(500).json({
      success: false,
      message: 'The product can\'t be created',
    });

  res.status(200).send(createdProduct);
});

export { router };