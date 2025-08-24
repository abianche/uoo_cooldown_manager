import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./fonts.css";
import { store } from "./store";

const theme = createTheme({
  primaryColor: "blue",
  fontFamily: "Avadonian, Inter, sans-serif",
  fontFamilyMonospace: "Avadonian, 'JetBrains Mono', monospace",
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <App />
      </MantineProvider>
    </Provider>
  </React.StrictMode>
);
