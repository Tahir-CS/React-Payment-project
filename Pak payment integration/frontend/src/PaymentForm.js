import React, { useState } from 'react';

const PaymentForm = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle payment submission
    console.log({ paymentMethod, amount });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Pakistani Payment Gateway</h2>
      <div>
        <label>Payment Method:</label>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="">Select Payment Method</option>
          <option value="jazzcash">Jazz Cash</option>
          <option value="easypaisa">Easy Paisa</option>
          <option value="bank">Bank Transfer</option>
        </select>
      </div>
      <div>
        <label>Amount:</label>
        <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <button type="submit">Pay</button>
    </form>
  );
};

export default PaymentForm;