import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Registros() {
  const [registroTipo, setRegistroTipo] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTiposDocumento = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/tipo-documento');
        const data = await response.json();
        setTiposDocumento(data);
      } catch (error) {
        console.error('Error al cargar tipos de documento:', error);
      }
    };

    fetchTiposDocumento();
  }, []);

  const handleRegistroTipo = (tipo) => {
    setRegistroTipo(tipo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crear el objeto de datos para enviar
    let url = '';
    let userData = {};

    if (registroTipo === 'usuario') {
      userData = {
        nombre: e.target.nombre.value,
        apellido: e.target.apellido.value,
        cedula: e.target.cedula.value
      };
      url = 'http://localhost:3001/api/registrar-usuario';
    } else if (registroTipo === 'cliente') {
      userData = {
        cedula: e.target.cedula.value,
        nombre: e.target.nombre.value,
        apellido: e.target.apellido.value,
        telefono: e.target.telefono.value,
        direccion: e.target.direccion.value,
        barrio: e.target.barrio.value,
        id_ciudad: e.target.id_ciudad.value,
        palabra_clave: e.target.palabra_clave.value
      };
      url = 'http://localhost:3001/api/registrar-cliente';
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar');
      }

      const result = await response.json();
      setMensaje(result.message);
      setShowConfirmation(true);
    } catch (error) {
      setMensaje(`Error: ${error.message}`);
      setShowConfirmation(true);
    }
  };

  const handleClose = () => {
    setShowConfirmation(false);
    setRegistroTipo('');
  };

  return (
    <div className="container">
      {showConfirmation && (
        <div className="overlay">
          <div className="confirmation-card">
            <p>{mensaje}</p>
            <button onClick={handleClose}>Aceptar</button>
          </div>
        </div>
      )}

      <div className="card">
        <h2>¿Qué desea registrar?</h2>
        {registroTipo === '' ? (
          <>
            <button onClick={() => handleRegistroTipo('cliente')} className="button1">
              Registrar Cliente
            </button>
            <button onClick={() => handleRegistroTipo('usuario')} className="button1">
              Registrar Usuario
            </button>
            <button onClick={() => navigate('/')} className="button2">Volver</button>
          </>
        ) : (
          <>
            {registroTipo === 'cliente' && (
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="cedula">Documento:</label>
                  <input type="text" id="cedula" name="cedula" required pattern="\d*" onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} />
                </div>
                <div className="input-group">
                  <label htmlFor="nombre">Nombre:</label>
                  <input type="text" id="nombre" name="nombre" required pattern="[A-Za-z]+" onInput={(e) => e.target.value = e.target.value.replace(/[^a-zA-Z]/g, '')} />
                </div>
                <div className="input-group">
                  <label htmlFor="apellido">Apellido:</label>
                  <input type="text" id="apellido" name="apellido" required pattern="[A-Za-z]+" onInput={(e) => e.target.value = e.target.value.replace(/[^a-zA-Z]/g, '')} />
                </div>
                <div className="input-group">
                  <label htmlFor="telefono">Teléfono:</label>
                  <input type="text" id="telefono" name="telefono" required pattern="\d*" onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} />
                </div>
                <div className="input-group">
                  <label htmlFor="direccion">Dirección:</label>
                  <input type="text" id="direccion" name="direccion" required />
                </div>
                <div className="input-group">
                  <label htmlFor="barrio">Barrio:</label>
                  <input type="text" id="barrio" name="barrio" required />
                </div>
                <div className="input-group">
                  <label htmlFor="id_ciudad">Ciudad:</label>
                  <input type="text" id="id_ciudad" name="id_ciudad" required pattern="\d*" onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} />
                </div>

                <div className="input-group">
                  <label htmlFor="palabra_clave">Palabra Clave:</label>
                  <input 
                    type="text" 
                    id="palabra_clave" 
                    name="palabra_clave"  
                    title='Ingrese una Palabra clave segura' 
                    required/>
                </div>
                <div>
                  <button className="button1" type="submit">Registrar Cliente</button>
                  <button onClick={() => setRegistroTipo('')} className="button1">Volver</button>
                </div>
              </form>
            )}

            {registroTipo === 'usuario' && (
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="nombre">Nombre:</label>
                  <input type="text" id="nombre" name="nombre" required pattern="[A-Za-z]+" onInput={(e) => e.target.value = e.target.value.replace(/[^a-zA-Z]/g, '')} />
                </div>
                <div className="input-group">
                  <label htmlFor="apellido">Apellido:</label>
                  <input type="text" id="apellido" name="apellido" required pattern="[A-Za-z]+" onInput={(e) => e.target.value = e.target.value.replace(/[^a-zA-Z]/g, '')} />
                </div>
                <div className="input-group">
                  <label htmlFor="cedula">Cédula:</label>
                  <input type="text" id="cedula" name="cedula" required pattern="\d*" onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} />
                </div>
                <div>
                  <button className="button1" type="submit">Registrar Usuario</button>
                  <button onClick={() => setRegistroTipo('')} className="button1">Volver</button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Registros;