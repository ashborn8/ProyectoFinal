import '../App.css' 
import Logo from '../assets/image/logoAgencia.PNG';
import QR from '/src/image/QR.jpeg';
import { useLocation } from 'react-router-dom';

function Recibo() {
  const location = useLocation();
  const { 
    nombre,
    descripcion,
    tamano,
    imagen, 
    precio,
    cedula_cliente,
    clienteData
  } = location.state || {};

  // Datos del servicio
  const producto = {
    nombre: nombre || 'Servicio',
    especificaciones: `${tamano} - ${descripcion || 'Sin descripción'}`,
    precio: precio || 0,
    cantidad: 1,
    imagen: imagen || 'Sin imagen'
  };

  // Cálculos
  const subtotal = producto.precio * producto.cantidad;
  const total = subtotal;
  const fecha = new Date().toLocaleDateString();
  const numeroRecibo = 'F-' + Math.floor(Math.random() * 10000);
  const nequiNumero = '3163834176';

  return (
    <>
      <div className="container">
        <header>
            <div className="company-info">
                <img src={Logo} alt="Logo Agencia" className="company-logo" />
            </div>
            <div className="invoice-details">
                <h2>Recibo de Caja</h2>
                <p>Número de Recibo: <span>{numeroRecibo}</span></p>
                <p>Fecha: <span>{fecha}</span></p>
            </div>
        </header>

        <table>
            <thead>
                <tr>
                    <th>Tipo de Servicio</th>
                    <th>Especificaciones</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{producto.nombre}</td>
                    <td>{producto.especificaciones}</td>
                    <td>${producto.precio.toLocaleString()}</td>
                    <td>{producto.cantidad}</td>
                    <td>${subtotal.toLocaleString()}</td>
                </tr>
            </tbody>
        </table>

        <div className="summary">
            <p>Subtotal: <span>${subtotal.toLocaleString()}</span></p>
            <p>TOTAL: <span>${total.toLocaleString()}</span></p>
        </div>

        <div className="payment-info">
            <h3>Información para el Pago</h3>
            <p>Consigne a este Nequi para finalizar la compra</p>
            <p>Número de Nequi: <span>{nequiNumero}</span></p>
        </div>

        <footer>
            <p>Cliente: <span>{clienteData?.nombre || 'Cliente no especificado'}</span></p>
            <p>C.C. Cliente: <span>{cedula_cliente || 'Sin cédula'}</span></p>
            <p>Archivo adjunto: <span>{imagen || 'Sin archivo'}</span></p>
        </footer>
        <img src={QR} alt="Código QR" className="qr-code" />
      </div>
      
      <div className="download-circle">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="download-icon" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
        </svg>
      </div>
    </>
  )
}

export default Recibo