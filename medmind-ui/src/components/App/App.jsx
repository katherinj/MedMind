import * as React from "react";
import { Landing } from "components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <React.Fragment>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
          </Routes>
        </BrowserRouter>
      </React.Fragment>
    </div>
  );
}
