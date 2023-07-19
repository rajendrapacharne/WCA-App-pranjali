import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CurrencyConverter from './CurrencyConverter';
import WeatherPage from './WeatherPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/">Currency Converter</Link>
            </li>
            <li>
              <Link to="/weather">Weather</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<CurrencyConverter />} />
          <Route path="/weather" element={<WeatherPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
