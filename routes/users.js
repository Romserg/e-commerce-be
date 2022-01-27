import express from 'express';
import { User } from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get(`/`, async (req, res) => {
  const userList = await User.find().select('-passwordHash');

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

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

router.put(`/:id`, async (req, res) => {
  try {
    const userExist = await User.findById(req.params.id);
    let newPassword;

    if (req.body.password) {
      newPassword = bcrypt.hashSync(req.body.password, 10);
    } else {
      newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        passwordHash: newPassword,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
      },
      { new: true },
    );

    if (!user)
      return res.status(400).send('The user can\'t be updated');

    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
});

router.delete(`/:id`, async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user)
      return res.status(400).json({ success: false, message: 'User with provided ID not found' });

    return res.status(200).json({ success: true, message: 'The user is deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
});

router.post(`/login`, async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return res.status(400).send('The user not found');

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const secret = process.env.secret;
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin
      },
      secret,
      {
        expiresIn: '1w',
      },
    );

    return res.status(200).send({ user: user.email, token });
  } else {
    return res.status(400).send('Wrong password');
  }
});

router.post(`/register`, async (req, res) => {
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
})

router.get(`/get/count`, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    if (!usersCount) {
      return res.status(400).json({ success: false, message: 'No users provided' });
    }

    return res.status(200).send({ usersCount });
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
});

export { router };