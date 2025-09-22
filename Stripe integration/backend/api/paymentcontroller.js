
//This file handles the 'how' How do we create a payment 
//its kept separate so we can focus on the payment logic without server setup  noise
//we need the stripe sdk and our secret key here
const stripe= require('stripe')(process.env.STRIPE_SECRET_KEY);

//The mai function to create a  payment intent 

const createPaymentIntent = async (reqmres)=>{
    try{
       // always validate input from the frontned
       //here we get the ammount from request body
       const {amount}=reqmres.body;

       //basic validation L aEnsure amount is a positive\ number 

       // Basic validation: Ensure amount is a positive number.
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount provided.' });
    }   
 // Talk to Stripe using the secret key to create the payment intent.
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // The amount in cents.
      currency: 'usd',
      // In a real app, you might add more details like a customer ID or metadata.
      payment_method_types: ['card'],
    });

    // Send the unique 'client_secret' back to the frontend.
    // The frontend needs this to finalize the payment.
    res.json({ clientSecret: paymentIntent.client_secret });

  } catch (error) {
    // Developer thought: Implement robust error handling.
    // Log the detailed error for our own debugging.
    console.error('Error creating payment intent:', error);

    // Send a generic, user-friendly error message to the frontend for security.
    // We don't want to leak implementation details.
    res.status(500).json({ error: 'Failed to create payment intent. Please try again.' });
  }
};

// Export the function so server.js can import and use it.
module.exports = {
  createPaymentIntent,
};
