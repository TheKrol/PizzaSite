import Stripe from 'stripe';
import express from 'express';
import dotenv from "dotenv";

// dotenv to keep Mongo connection save
dotenv.config();

const stripe = Stripe(process.env.STRIPE_KEY);

const router = express.Router()

router.post('/create-checkout-session', async (req, res) => {
  const email = req.body.email; 
  const orderType = req.body.orderType; 
  const orderNote = req.body.orderNote;

  // Assuming there's a 6% tax rate
  const taxRate = 0.06;

  const line_items = req.body.orderItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.type,
          metadata: {
            id: item.id,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    };
  });

  // Calculate total amount including tax
  const subtotal = line_items.reduce((total, item) => total + item.price_data.unit_amount * item.quantity, 0);
  const taxAmount = Math.round(subtotal * taxRate);

  line_items.push({
    price_data: {
      currency: "usd",
      product_data: {
        name: "Tax",
      },
      unit_amount: taxAmount,
    },
    quantity: 1,
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    currency: 'usd',
    line_items,
    mode: 'payment',
    success_url: 'http://localhost:3000/orderConfirmation',
    cancel_url: 'http://localhost:3000/orderCart',
    customer_email: email, // Pass email for receipt
    metadata: {
      orderType,
      orderNote,
    },
  });

  res.send({ url: session.url });
});


  export default router;