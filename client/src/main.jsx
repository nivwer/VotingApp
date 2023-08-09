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
// ThemeProvider.

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
