import React from "react";
import { useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { clearUserData } from "../../redux/user/slice";
import { Link } from "react-router-dom";

const Home = () => {
  const userData = useSelector((state) => state.user.userData);
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const dispatch = useDispatch();
  console.log(userData);

  const handleLogout = () => {
    console.log("logout");
    removeCookie("token");
    dispatch(clearUserData());
  };

  return (
    <div>
      <h1>Hello {userData ? userData.name : "User"}</h1>
      <button onClick={handleLogout}>
        <Link to="/">logout</Link>
      </button>
    </div>
  );
};

export default Home;
