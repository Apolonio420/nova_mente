import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css"; // Importamos el CSS

import HomePage from "./components/HomePage";
import StorePage from "./components/StorePage";
import ProductPage from "./components/ProductPage";

function App() {
  return (
    <Router>
      <div>
        {/* Barra de navegación */}
        <nav className="navbar">
          <div className="logo">
            {/* Aquí puedes poner un logo */}
            <Link to="/">Logo</Link>
          </div>
          <div className="nav-links">
            <ul>
              <li>
                <Link to="/store">Store</Link>
              </li>
              <li>
                <Link to="/signup">Sign Up</Link>
              </li>
              <li>
                <Link to="/login">Log In</Link>
              </li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
