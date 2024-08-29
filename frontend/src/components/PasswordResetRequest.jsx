import React, { useState } from "react";
import axios from "axios";

const PasswordResetRequest = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/users/password-reset/",
        { email }
      );
      setMessage("Password reset email sent (if the email is registered).");
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error("Error requesting password reset:", error);
    }
  };

  return (
    <div>
      <h2>Password Reset Request</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Request Password Reset</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PasswordResetRequest;
