import express from 'express';
import { User } from '../models/user.js';

const router = express.Router();

router.get(`/`, async (req, res) =>{
  const userList = await User.find();

  if(!userList) {
    res.status(500).json({success: false})
  }
  res.send(userList);
})

export { router };