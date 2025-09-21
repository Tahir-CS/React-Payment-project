import { useState } from 'react'; // Importing useState for potential future state management (e.g., for payment form inputs)
import './App.css'; // Importing styles for the app
import PaymentForm from './PaymentForm'; // Import the new payment component

function App() {
  // As an engineer, I'd consider: This is the main component. We'll build it modularly—start with a hero section, then add more as we go.
  // For now, no state is needed, but useState is kept for future use (e.g., handling payment success).

  return (
    <>
      {/* Hero Section: This is the main landing area. Engineers think about user engagement—make it visually appealing and clear. */}
      <section className="hero">
        <h1>Welcome to Our Service</h1>
        <p>Experience seamless payments with our integrated solution.</p>
        {/* Replace placeholder button with payment form for integration */}
        <PaymentForm />
      </section>

      {/* Features Section: Highlight key benefits. Engineers add this to build trust before payment. */}
      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="feature-list">
          <div className="feature">
            <h3>Secure Payments</h3>
            <p>Integrated with industry-standard security.</p>
          </div>
          <div className="feature">
            <h3>Easy Integration</h3>
            <p>Simple setup for your needs.</p>
          </div>
          <div className="feature">
            <h3>Fast Processing</h3>
            <p>Quick transactions every time.</p>
          </div>
        </div>
      </section>

      {/* Footer: Basic footer for completeness. Engineers add this early to plan for branding and links. */}
      <footer>
        <p>&copy; 2023 Our Company. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;