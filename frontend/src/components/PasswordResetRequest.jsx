import React, { useState } from "react";
import axios from "axios";
import "./passwordreset.css";

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
    <div className="resetcontainer">
      <div className="title">Password Reset Request</div>
      <form onSubmit={handleSubmit}>
        <div className="overall">
          <div className="input">
            <input
              type="email"
              id="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="newsubmit">
          <button className="resetsubmit" type="submit">
            Send Request
          </button>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PasswordResetRequest;
