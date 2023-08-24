// React config.
import React from "react";
import ReactDOM from "react-dom/client";
// App component.
import App from "./App.jsx";
// Default styles.
import "./index.css";
// Fonts.
// Redux Toolkit Provider.
import { store } from "./app/store/rootReducer.js";
import { Provider } from "react-redux";
// Chakra-ui Provider.
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
