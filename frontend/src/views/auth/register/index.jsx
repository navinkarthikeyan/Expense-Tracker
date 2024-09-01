import { registerUser } from "../../../api";
import { useState } from "react";
import { toast } from "sonner";
import zxcvbn from "zxcvbn";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [email, setEmail] = useState("");
  const [role] = useState("user");

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    const strength = zxcvbn(newPassword).score;
    setPassword(newPassword);
    setPasswordStrength(strength);
  };

  const handlePassword2Change = (e) => {
    setPassword2(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error("Passwords does not match.");
      return;
    }

    const promise = registerUser({
      username,
      password,
      password2,
      email,
      role,
    });

    toast.promise(promise, {
      loading: "Loading...",
      success: `Registration successful`,
      error: (err) => {
        return Object.values(err)
          .map((e) => e)
          .join(", ");
      },
    });
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="header">
          <div className="text">Register</div>
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
              onChange={handlePasswordChange}
              required
            />
          </div>

          <div className="input">
            <input
              type="password"
              placeholder="Password again"
              value={password2}
              onChange={handlePassword2Change}
              required
            />
          </div>
          <div className="passwordstrength">
            <div>Password Strength</div>
            <div className="bar">
              <progress value={passwordStrength} max="4" />
            </div>
          </div>

          <div className="input">
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="submit-container">
          <button type="submit" className="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
