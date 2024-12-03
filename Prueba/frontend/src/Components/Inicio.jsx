import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import Logo from '../assets/image/logoAgencia.PNG';

function Home() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const response = await fetch('http://localhost:3001/api/iniciar-sesion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Datos del usuario recibidos:', data.user);
        
        localStorage.setItem('userCedula', data.user.cedula);
        localStorage.setItem('userName', data.user.nombreCompleto);
        
        console.log('Datos guardados en localStorage:', {
          cedula: localStorage.getItem('userCedula'),
          nombre: localStorage.getItem('userName')
        });
        
        setMessage('¡Sesión iniciada con éxito!');
        setIsError(false);
        setIsLoggedIn(true);
      } else {
        setMessage(data.message);
        setIsError(true);
      }
    } catch (error) {
      setMessage('Error al conectar con el servidor');
      setIsError(true);
    }
  };

  const handleAccept = () => {
    navigate('/publicidad');
  };

  const handleLogout = () => {
    localStorage.removeItem('userCedula');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
  };

  return (
    <>
      <div className="card">
        <header>
          <h1>Gestor de ventas</h1>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Usuario:</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div className="input-group">
            <label htmlFor="password">Contraseña:</label>
            <input type="password" id="password" name="password" required />
          </div>
          <div className="button-group">
            <button className="button1" type="submit">
              Ingresar
            </button>
            <button
              className="button1"
              type="button"
              onClick={() => navigate('/registros')}
            >
              Registrar
            </button>
          </div>
        </form>
        {isError && (
          <div className='container'>
            <div className='overlay'>
          <div className="confirmation-card">
            <p>{message}</p>
            <button onClick={() => setIsError(false)}>Aceptar</button>
          </div>
          </div>
          </div>
        )}
        {isLoggedIn && (
          <div className='container'>
            <div className='overlay'>
              <div className="confirmation-card">
                <p>¡Sesión iniciada con éxito!</p>
                <button onClick={handleAccept}>Aceptar</button>
              </div>
            </div>
          </div>
        )}
        <div className="red-card">
          <img src={Logo} alt="Logo" className='logo'/>
        </div>
      </div>
    </>
  );
}

export default Home;