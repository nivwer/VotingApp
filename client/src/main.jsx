import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "@fontsource/gothic-a1/100.css";
import "@fontsource/gothic-a1/200.css";
import "@fontsource/gothic-a1/300.css";
import "@fontsource/gothic-a1/400.css";
import "@fontsource/gothic-a1/500.css";
import "@fontsource/gothic-a1/600.css";
import "@fontsource/gothic-a1/700.css";
import "@fontsource/gothic-a1/800.css";
import "@fontsource/gothic-a1/900.css";
import { store } from "./app/store/rootReducer.js";
import { Provider } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeScript } from "@chakra-ui/color-mode";
import theme from "./theme/theme.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
);
