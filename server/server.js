const express = require("express");
const Stripe = require("stripe");
const QRCode = require("qrcode");
// const fs = require("fs"); // Uncomment if needed
const path = require("path");
const app = express();
const port = 5000; 
const SECRET_KEY = process.env.SECRET_KEY;

const stripe = Stripe(SECRET_KEY, { apiVersion: "2023-10-16" });

app.use(express.json());

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
app.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body;
  if (!price || isNaN(price)) {
    return res.status(400).send({ error: "Invalid price format" });
  }
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: "usd",
      payment_method_types: ["card"],
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});
