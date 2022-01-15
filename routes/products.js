import express from 'express';
import { Product } from '../models/product.js';
import { Category } from '../models/category.js';

const router = express.Router();

router.get(`/`, async (req, res) => {
  let queriedCategories = {};
  if (req.query.categories) {
    queriedCategories = { category: req.query.categories.split(',') };
  }
  const productList = await Product.find(queriedCategories).populate('category').select('name image -_id');
  if (!productList) {
    return res.status(500).json({ success: false });
  }
  return res.status(200).send(productList);
});

router.get(`/:id`, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(400).json({ success: false, message: 'Product not found' });
    }

    return res.status(200).send(product);
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
    return res.status(400).json({
      success: false,
      message: 'The product can\'t be created',
    });

  return res.status(200).send(createdProduct);
});

router.put(`/:id`, async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category)
      return res.status(400).send('Invalid category');
  } catch (err) {
    return res.status(500).send(err);
  }

  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
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
      },
      { new: true },
    );

    if (!product)
      return res.status(400).send('The product can\'t be updated');

    return res.status(200).send(product);
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
});

router.delete(`/:id`, async (req, res) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id);
    if (!product)
      return res.status(400).json({ success: false, message: 'Product with provided ID not found' });

    return res.status(200).json({ success: true, message: 'The product is deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
});

router.get(`/get/count`, async (req, res) => {
  try {
    const productsCount = await Product.countDocuments();
    if (!productsCount) {
      return res.status(400).json({ success: false, message: 'No products provided' });
    }

    return res.status(200).send({ productsCount });
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
});

router.get(`/get/featured/:count`, async (req, res) => {
  try {
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({ isFeatured: true }).limit(Number(count));
    if (!products) {
      return res.status(400).json({ success: false, message: 'No products provided' });
    }

    return res.status(200).send({ products });
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
});

export { router };