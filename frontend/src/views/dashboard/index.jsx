import React from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { clearUserData } from "../../redux/user/slice";
import { Link } from "react-router-dom";

const index = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    console.log("logout");
    Cookies.remove("token");
    dispatch(clearUserData());
  };
  return (
    <div>
      <h1>Hello admin</h1>
      <button onClick={handleLogout}>
        <Link to="/">logout</Link>
      </button>
    </div>
  );
};

export default index;
