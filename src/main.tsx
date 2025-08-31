import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./fonts.css";

const theme = createTheme({
  primaryColor: "blue",
  fontFamily: "Avadonian, Inter, sans-serif",
  fontFamilyMonospace: "Avadonian, 'JetBrains Mono', monospace",
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <App />
    </MantineProvider>
  </React.StrictMode>
);
