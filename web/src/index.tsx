import { ColorModeScript } from "@chakra-ui/react";
import * as React from "react";
import { SearchPage } from "./SearchPage";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppWrapper from "./AppWrapper";

const container = document.getElementById("root") as Element;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ColorModeScript />
      <AppWrapper>
        <Routes>
          <Route path="/" element={<SearchPage />} />
        </Routes>
      </AppWrapper>
    </BrowserRouter>
  </React.StrictMode>
);
