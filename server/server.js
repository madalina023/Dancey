const express = require("express");
const Stripe = require("stripe");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 5000;

const PUBLISHABLE_KEY =
  "pk_test_51OuYOCRqRmTxzPBOLwxDwFgkoiNZdsScBfbrXtbWc5PI3IjxfWwdtjT2wEk2iQ1Q21Updvj7xwshTmGHMOnp9Ygh00W4I3bihS";
const SECRET_KEY =
  "sk_test_51OuYOCRqRmTxzPBOyRbN8hmanR17Ri1iM5Vet0gEMsu1llwnzb2WPj5Tsty9VNOAFGEh7nZV7wYy7Hv5OOveI5ed00MIacZ8bc";
const stripe = Stripe(SECRET_KEY, { apiVersion: "2023-10-16" });

app.use(express.json());

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

app.post("/create-payment-intent", async (req, res) => {
  console.log("Create payment intent request body:", req.body); // Log to debug
  const { price } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price, // Use the provided price
      currency: "usd",
      payment_method_types: ["card"],
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Error creating payment intent:", err);
    res.status(500).send({
      error: err.message,
    });
  }
});

app.post("/validate-qr", (req, res) => {
  console.log("Validate QR request body:", req.body); // Log to debug
  const scannedData = req.body.qrData;

  // Read the expected QR data from the file
  fs.readFile("expected_qr_data.txt", "utf8", (err, expectedData) => {
    if (err) {
      console.error("Error reading the expected QR data:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Compare the scanned data with the expected data
    const isValid = scannedData === expectedData.trim();
    res.json({ isValid });
  });
});
