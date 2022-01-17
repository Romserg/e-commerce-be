import express from 'express';
import { User } from '../models/user.js';
import bcrypt from 'bcryptjs'

const router = express.Router();

router.get(`/`, async (req, res) =>{
  const userList = await User.find().select('-passwordHash');

  if(!userList) {
    res.status(500).json({success: false})
  }
  res.send(userList);
})

router.get(`/:id`, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');

    if (!user)
      return res.status(400).json({ success: false, message: 'User not found' });

    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
});

router.post(`/`, async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();

  if (!user)
    return res.status(400).send('The user can\'t be created');

  return res.status(200).send(user);
});

export { router };