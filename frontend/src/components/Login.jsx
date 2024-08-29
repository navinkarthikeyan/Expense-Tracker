import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../api";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({ username, password });
      setMessage(`Login successful! Token: ${data.token}, Role: ${data.role}`);
      setError("");
    } catch (err) {
      setError(err.non_field_errors || "Login failed");
      console.log(err);
      setMessage("");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="header">
          <div className="text">Login</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          <div className="input">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="forgot-password">
          <Link to="/password-reset-request">
            <span>Forgot Password ?</span>
          </Link>
        </div>
        <div className="submit-container">
          <div>
            <button className="submit">
              <Link className="signup" to="/register">
                Register
              </Link>
            </button>
          </div>
          <button className="submit">Login</button>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
      </form>
    </div>
  );
};
