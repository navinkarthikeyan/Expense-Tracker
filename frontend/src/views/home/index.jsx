import React from "react";
import { useSelector } from "react-redux";
import { useCookies } from "react-cookie";

const Home = () => {
  const userData = useSelector((state) => state.user.userData);
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  console.log(userData);

  const handleLogout = () => {
    console.log("logout");
    removeCookie("token");
  };

  return (
    <div>
      <h1>Hello {userData ? userData.name : "User"}</h1>
      <button onClick={handleLogout}>logout </button>
    </div>
  );
};

export default Home;
