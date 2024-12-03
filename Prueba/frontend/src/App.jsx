import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Inicio from './Components/Inicio.jsx';
import Registros from './Components/Registros.jsx';
import Publicidad from './Components/Publicidad.jsx';
import DisenoGrafico from './components/DisenoGrafico.jsx';
import MarketingDigital from './Components/MarketingDigital.jsx';
import './App.css';
import Recibo from './Components/Recibo.jsx';



const App = () => {
  return (
    <Router>
      <>
        <header className="menu">
          <div className="menu-header">
            <h2>Menú</h2>
          </div>
          <ul className="menu-items">
            <li><Link to="/">Inicio Sesion</Link></li>
            <li className="dropdown">
              <Link to="#">Servicios</Link>
              <ul className="submenu">
                <li><Link to="/publicidad">Publicidad</Link></li>
                <li><Link to="/diseno-grafico">Diseño Gráfico</Link></li>
                <li><Link to="/marketing-digital">Marketing Digital</Link></li>
              </ul>
            </li>
          </ul>
        </header>

        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/registros" element={<Registros />} />
          <Route path="/publicidad" element={<Publicidad />} />
          <Route path="/diseno-grafico" element={<DisenoGrafico />} />
          <Route path="/marketing-digital" element={<MarketingDigital />} /> 
          <Route path ="/recibo" element={<Recibo />} /> 

        </Routes>
      </>
    </Router>
  );
};

export default App;