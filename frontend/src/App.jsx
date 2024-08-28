import { useState } from "react";

import { Routes, Route } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Register from "./components/register";
import "./App.css";
import AppRouter from "./Router/AppRouter";

function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <AppRouter />
    </>
  );
}

export default App;
