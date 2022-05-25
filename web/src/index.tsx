import { ColorModeScript } from "@chakra-ui/react";
import * as React from "react";
import { SearchPage } from "./SearchPage";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppWrapper from "./AppWrapper";
import { StatisticsPage } from "./StatisticsPage";
import AnimePage from "./AnimePage";

const container = document.getElementById("root") as Element;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ColorModeScript />
      <AppWrapper>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/stats" element={<StatisticsPage />} />
          <Route path="/anime/:id" element={<AnimePage />} />
        </Routes>
      </AppWrapper>
    </BrowserRouter>
  </React.StrictMode>
);
