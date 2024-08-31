import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Toaster } from "sonner";
import { Provider, useDispatch } from "react-redux";
import App from "./App.jsx";
import { store } from "./redux/store";
import { useCookies } from "react-cookie";
import { setUserData } from "./redux/user/slice";
import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";

const theme = createTheme({});

const RootComponent = () => {
  const dispatch = useDispatch();
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    console.log(cookies);
    const token = cookies.token;
    if (token) {
      const userData = jwtDecode(token);
      dispatch(setUserData(userData));
    }
  }, [cookies, dispatch]);

  return <App />;
};

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <Toaster position="top-right" richColors />
    <Provider store={store}>
      <RootComponent />
    </Provider>
  </ThemeProvider>
);
