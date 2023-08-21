import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import Slide from "./components/Slide/Slide";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<HomePage />} />
        <Route path="/slide/:id" element={<Slide />} />
      </Routes>
    </Router>
  );
}

export default App;
