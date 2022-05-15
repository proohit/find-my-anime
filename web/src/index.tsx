import { ColorModeScript } from "@chakra-ui/react";
import * as React from "react";
import { App } from "./App";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root") as Element;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ColorModeScript />
    <App />
  </React.StrictMode>
);
