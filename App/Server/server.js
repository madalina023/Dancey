 // Import required libraries
import express from "express";
import Stripe from "stripe";
const app= express();
const port=3000;
const PUBLISHABLE_KEY="pk_test_51OuYOCRqRmTxzPBOLwxDwFgkoiNZdsScBfbrXtbWc5PI3IjxfWwdtjT2wEk2iQ1Q21Updvj7xwshTmGHMOnp9Ygh00W4I3bihS";
const SECRET_KEY="sk_test_51OuYOCRqRmTxzPBOyRbN8hmanR17Ri1iM5Vet0gEMsu1llwnzb2WPj5Tsty9VNOAFGEh7nZV7wYy7Hv5OOveI5ed00MIacZ8bc";
const stripe=Stripe(SECRET_KEY, {apiVersion:"2023-10-16"});

app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});
app.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body; // Extract price from the request body
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price, // Use the provided price
      currency: "usd",
      payment_method_types: ["card"],
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
});
