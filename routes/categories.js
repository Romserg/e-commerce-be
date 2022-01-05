import express from 'express';
import { Category } from '../models/category.js';

const router = express.Router();

router.get(`/`, async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(categoryList);
});

router.get(`/:id`, async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(500).json({ success: false, message: 'Category not found' });
  }
  res.status(200).send(category);
});

router.post(`/`, async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });
  category = await category.save();

  if (!category)
    return res.status(404).send('The category can\'t be created');

  res.status(200).send(category);
});

router.put(`/:id`, async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    },
    { new: true },
  );

  if (!category)
    return res.status(404).send('The category can\'t be updated');

  res.status(200).send(category);
});

router.delete(`/:id`, async (req, res) => {
  try {
    const category = await Category.findByIdAndRemove(req.params.id);
    if (!category)
      return res.status(404).json({ success: false, message: 'Category not found' });

    return res.status(200).json({ success: true, message: 'The category is deleted' });
  } catch (err) {
    res.status(400).json({ success: false, error: err });
  }
});

export { router };