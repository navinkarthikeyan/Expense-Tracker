import React from "react";
import { Link } from "react-router-dom";

export const Login = () => {
  return (
    <div className="container">
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <input type="text" placeholder="Username" />
        </div>
        <div className="input">
          <input type="password" placeholder="Password" />
        </div>
      </div>
      <div className="forgot-password">
        <span>Forgot Password ?</span>
      </div>
      <div className="submit-container">
        <div className="submit">
          <Link to="/register">SignUp</Link>
        </div>
        <div className="submit">Login</div>
      </div>
    </div>
  );
};
