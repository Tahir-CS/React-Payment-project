const express = require('express'); // Web framework for handling requests
const cors = require('cors'); // Allows cross-origin requests from frontend
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Stripe SDK; uses env var for security
require('dotenv').config(); // Loads environment variables from .env file

const app = express();
app.use(cors()); // Enables CORS for frontend-backend communication
app.use(express.json()); // Parses JSON request bodies

// Route to create a payment intent (engineers handle this server-side for security)
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body; // Get amount from frontend (e.g., 1000 for $10)
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' }); // Basic validation
    }

    // Create payment intent with Stripe (mock currency; engineers add more options like metadata)
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // In cents (e.g., 1000 = $10)
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.json({ clientSecret: paymentIntent.client_secret }); // Send client secret to frontend
  } catch (error) {
    console.error('Server error:', error); // Log for debugging
    res.status(500).json({ error: 'Internal server error' }); // Generic error for security
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));