import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./components/HomePage"; // Asegúrate de que el path sea correcto
import StorePage from "./components/StorePage"; // Asegúrate de que el path sea correcto
import ProductPage from "./components/ProductPage"; // Asegúrate de que el path sea correcto
import "./App.css"; // Importamos el CSS

function App() {
  return (
    <Router>
      <div>
        {/* Barra de navegación comentada para eliminarla */}
        {/* <nav className="navbar">
          <div className="logo">
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
        </nav> */}

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
