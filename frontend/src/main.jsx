import "./index.css";
import '@fontsource-variable/inter';

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
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0f0f0f",

    },
    secondary: {
      main: "#f6f6f6",
    },
  },
});

const RootComponent = () => {
  const dispatch = useDispatch();
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    const token = cookies.token;
    if (token) {
      const userData = jwtDecode(token);
      console.log(userData);
      dispatch(setUserData(userData));
    } else {
      dispatch(
        setUserData({
          isAuthenticated: false,
        })
      );
    }
  }, [cookies]);

  return <App />;
};

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <CssBaseline/>
    <Toaster position="top-right" richColors closeButton />
    <Provider store={store}>
      <RootComponent />
    </Provider>
  </ThemeProvider>
);
