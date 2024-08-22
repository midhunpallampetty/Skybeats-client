// pages/api/create-payment-intent.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { amount } = req.body; // Get the payment amount from the request body

      // Create a PaymentIntent with the specified amount
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'inr', // Change the currency to match your preference
      });

      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
