import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../../../api";
// import Button from "@mui/material/Button";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUserData } from "../../../redux/user/slice";
import { useCookies } from "react-cookie";
import zxcvbn from "zxcvbn";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    const strength = zxcvbn(newPassword).score;
    setPassword(newPassword);
    setPasswordStrength(strength);
  };

  const handleRedirect = (role) => {
    switch (role) {
      case "admin": {
        return navigate("/dashboard");
      }
      case "user": {
        return navigate("/home");
      }
      default: {
        return;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const promise = loginUser({ username, password });
    toast.promise(promise, {
      loading: "Loading...",
      success: (data) => {
        dispatch(setUserData(data));
        setCookie("token", data?.token, { path: "/" });
        handleRedirect(data?.role);
        return `Login successful! Role: ${data.role}`;
      },
      error: (err) => {
        return err.non_field_errors || "Login failed";
      },
    });
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
          <div>
            <div className="input">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div>
              <progress value={passwordStrength} max="4" />
            </div>
          </div>
        </div>
        <div className="forgot-password">
          <Link to="/reset/request">
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
          {/* <Button variant="contained">Login</Button> */}
          <button className="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
