// --------------------------------------------------
// 1) Import React + Stripe tools
// --------------------------------------------------
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js'; 
// loadStripe = securely loads Stripe with your publishable key

import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// Elements   = provider that gives Stripe context to child components
// CardElement = prebuilt secure input for card details
// useStripe   = hook to access the Stripe instance
// useElements = hook to access input fields (like CardElement)


// --------------------------------------------------
// 2) Initialize Stripe with your TEST publishable key
// --------------------------------------------------
// - Publishable key (pk_test_...) is safe to expose in frontend
// - Secret key (sk_test_...) must NEVER go in frontend (backend only)
const stripePromise = loadStripe('pk_test_your_stripe_publishable_key_here');


// --------------------------------------------------
// 3) CheckoutForm component
// --------------------------------------------------
// - Handles form UI, talks to backend, confirms payments
function CheckoutForm() {
  const stripe = useStripe();      // Stripe instance (from Elements provider)
  const elements = useElements();  // Access to form fields (e.g., CardElement)

  // React state
  const [loading, setLoading] = useState(false); // Prevents double-submit
  const [message, setMessage] = useState('');    // Success message
  const [error, setError] = useState('');        // Error message


  // --------------------------------------------------
  // 4) Form submit handler
  // --------------------------------------------------
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page reload

    if (!stripe || !elements) return; // Wait until Stripe is fully ready

    setLoading(true);   // Show spinner / disable button
    setError('');       // Clear old errors
    setMessage('');     // Clear old success messages

    try {
      // -------------------------------
      // Step 1: Ask backend to create PaymentIntent
      // -------------------------------
      // - Frontend sends amount to backend (in cents: $10 = 1000)
      // - Backend talks to Stripe with SECRET key to create PaymentIntent
      // - Backend returns "clientSecret" (unique token for this payment)
      const response = await fetch('http://localhost:3001/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1000 }), // amount = 1000 cents ($10)
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const { clientSecret, error: serverError } = await response.json();
      if (serverError) throw new Error(serverError);

      // -------------------------------
      // Step 2: Confirm payment with Stripe.js
      // -------------------------------
      // - Uses clientSecret from backend
      // - Grabs card details from <CardElement>
      // - Stripe securely confirms the card charge
      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement), // actual card data
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message); // e.g., declined card
      }

      // If all good → payment successful 🎉
      setMessage('✅ Payment successful!');
    } catch (err) {
      // Catch any error (backend, network, or Stripe)
      setError(err.message);
      console.error('Payment error:', err);
    } finally {
      // Always reset button state
      setLoading(false);
    }
  };


  // --------------------------------------------------
  // 5) Render form UI
  // --------------------------------------------------
  return (
    <form onSubmit={handleSubmit} className="payment-form">

      {/* Input for card details (Stripe-secure) */}
      <label>Card Details</label>
      <CardElement 
        options={{
          style: {
            base: { fontSize: '16px', color: '#32325d' }, // base styling
            invalid: { color: '#fa755a' },                 // error styling
          },
        }}
      />

      {/* Submit button (disabled until Stripe loads or processing starts) */}
      <button disabled={!stripe || loading} type="submit">
        {loading ? 'Processing...' : 'Pay $10'}
      </button>

      {/* Feedback messages */}
      {message && <p style={{ color: 'green' }}>{message}</p>} {/* Success message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}       {/* Error message */}
    </form>
  );
}


// --------------------------------------------------
// 6) Export main PaymentForm component
// --------------------------------------------------
// - Wraps CheckoutForm inside <Elements> provider
// - Passes in the Stripe instance (stripePromise)
export default function PaymentForm() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}





