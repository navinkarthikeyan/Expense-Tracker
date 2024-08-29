import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";

const PasswordResetConfirm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { uidb64, token } = useParams();
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/users/password-reset-confirm/`,
        {
          uidb64: uidb64,
          token: token,
          new_password: newPassword,
        }
      );
      console.log(response);
      setMessage(response.data.message);
      setError("");
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default PasswordResetConfirm;
