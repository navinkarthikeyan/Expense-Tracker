import React from "react";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="container">
      <div className="header">
        <div className="text">Register</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <input type="text" placeholder="Username" />
        </div>
        <div className="input">
          <input type="password" placeholder="Password" />
        </div>

        <div className="input">
          <input type="password" placeholder="Password again" />
        </div>
        <div className="input">
          <input type="text" placeholder="Email" />
        </div>
      </div>
      <div className="submit-container">
        <div className="submit">Register</div>
      </div>
    </div>
  );
}
