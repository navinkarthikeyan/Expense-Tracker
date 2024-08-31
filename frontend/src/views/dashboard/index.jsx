import React from "react";
import Cookies from "js-cookie";

const index = () => {
  const handleLogout = () => {
    console.log("logout");
    Cookies.remove("token");
  };
  return (
    <div>
      <h1>Hello admin</h1>
      <button onClick={handleLogout}>logout </button>
    </div>
  );
};

export default index;
