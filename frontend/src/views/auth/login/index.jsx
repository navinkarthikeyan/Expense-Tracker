import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { loginUser } from "../../../api";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../../../redux/user/slice";
import { useCookies } from "react-cookie";

const Login = () => {
  const userData = useSelector((state) => state.user.userData);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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

  useEffect(() => {
    if (location.pathname === "/") {
      handleRedirect(userData?.role);
    }
  }, [location?.pathname, userData?.role]);

  return (
    <div className="main-container">
      <div className="header-title">Expense Tracker Application</div>
      <div className="login-container">
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
            <Link to="/reset/request">
              <span>Forgot Password ?</span>
            </Link>
          </div>
          <div className="submit-container">
            <div>
              <button className="submit">Login</button>
            </div>
            <button className="submit">
              <Link className="signup" to="/register">
                Register
              </Link>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
