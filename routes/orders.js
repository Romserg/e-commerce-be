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

router.get(`/:id`, async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({
      path: 'orderItems', populate: {
        path: 'product', populate: {
          path: 'category',
        },
      },
    });

  if (!order) {
    res.status(500).json({ success: false });
  }
  res.send(order);
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

  const totalPrices = await Promise.all(orderItemsIds.map(async orderItemId => {
      const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');

      return orderItem.product.price * orderItem.quantity;
    }),
  );

  const totalPrice = totalPrices.reduce((acc, value) => acc + value, 0);

  let order = new Order({
    orderItems: orderItemsIds,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });
  order = await order.save();

  if (!order)
    return res.status(400).send('The order can\'t be created');

  return res.status(200).send(order);
});

router.put(`/:id`, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      { new: true },
    );

    if (!order)
      return res.status(400).send('The order can\'t be updated');

    return res.status(200).send(order);
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
});

router.delete(`/:id`, async (req, res) => {
  try {
    const order = await Order.findByIdAndRemove(req.params.id);
    if (!order)
      return res.status(400).json({ success: false, message: 'Order with provided ID not found' });

    await order.orderItems.map(async orderItem => {
      await OrderItem.findByIdAndRemove(orderItem);
    });
    return res.status(200).json({ success: true, message: 'The order is deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
});

export { router };