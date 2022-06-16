import { ColorModeScript, Spinner } from "@chakra-ui/react";
import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppWrapper from "./AppWrapper";

const container = document.getElementById("root") as Element;
const root = createRoot(container);
const SearchPage = lazy(() => import("./SearchPage"));
const StatisticsPage = lazy(() => import("./StatisticsPage"));
const AnimePage = lazy(() => import("./AnimePage"));

root.render(
  <StrictMode>
    <BrowserRouter>
      <ColorModeScript />
      <AppWrapper>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/stats" element={<StatisticsPage />} />
            <Route path="/anime/:id" element={<AnimePage />} />
          </Routes>
        </Suspense>
      </AppWrapper>
    </BrowserRouter>
  </StrictMode>
);
