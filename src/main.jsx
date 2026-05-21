import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Lab from "./pages/Lab.jsx";
import Experiment from "./pages/Experiment.jsx";
import NotFound from "./pages/NotFound.jsx";
import { ThemeProvider } from "./contexts/theme";

import "./index.css";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route element={<App />}>
            <Route index element={<Home />} />
            <Route path="lab" element={<Lab />} />
            <Route path="lab/:slug" element={<Experiment />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
