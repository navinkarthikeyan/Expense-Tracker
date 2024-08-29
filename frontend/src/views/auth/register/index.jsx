import { registerUser } from "../../../api";
import { useState } from "react";
import { toast } from "sonner";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");
  const [role] = useState("user");

  const handleSubmit = async (e) => {
    e.preventDefault();
    //???
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
        return err.non_field_errors || "Registration failed";
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
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input">
            <input
              type="password"
              placeholder="Password again"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
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
