import express from 'express';
import { Order } from '../models/order.js';
import { OrderItem } from '../models/order-item.js';

const router = express.Router();

router.get(`/`, async (req, res) => {
  const orderList = await Order.find().populate('user', 'name').sort('-dateOrdered');

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

router.post(`/`, async (req, res) => {
  const orderItemsIds = await Promise.all(
    req.body.orderItems.map(async orderItem => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    }),
  );

  let order = new Order({
    orderItems: orderItemsIds,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: req.body.totalPrice,
    user: req.body.user,
  });
  order = await order.save();

  if (!order)
    return res.status(400).send('The order can\'t be created');

  return res.status(200).send(order);
});

export { router };