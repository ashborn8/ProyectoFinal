import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ImpresionDigitalOptions = ({ onBack, onContinue }) => {
    const [selectedSize, setSelectedSize] = useState('');
    const [customerInfo, setCustomerInfo] = useState('');
    const [file, setFile] = useState(null);
    const [palabraClave, setPalabraClave] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [tipoServicio] = useState('Impresión Digital');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const getPrecioByTamano = (tamano) => {
        const precios = {
            'Impresión Digital A3': 20000,
            'Impresión Digital A4': 20000
        };
        return precios[tamano] || 0;
    };

    const handleContinue = async () => {
        if (!selectedSize) {
            setError('Por favor, seleccione un tamaño de impresión.');
            return;
        }
        if (!customerInfo) {
            setError('Por favor, ingrese la información del cliente.');
            return;
        }
        if (!file) {
            setError('Por favor, seleccione un archivo.');
            return;
        }
        if (!palabraClave) {
            setError('Por favor, ingrese la palabra clave.');
            return;
        }

        try {
            const clienteResponse = await fetch(`http://localhost:3001/api/cliente/por-palabra-clave/${palabraClave}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const clienteData = await clienteResponse.json();

            if (!clienteResponse.ok) {
                setError('No se encontró un cliente con la palabra clave proporcionada.');
                return;
            }

            const servicioData = {
                nombre: tipoServicio,
                descripcion: customerInfo,
                tamano: selectedSize,
                imagen: file.name,
                precio: getPrecioByTamano(selectedSize),
                cedula_cliente: clienteData.cliente.cedula
            };

            const servicioResponse = await fetch('http://localhost:3001/api/registrar-servicio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(servicioData)
            });

            if (!servicioResponse.ok) {
                const errorData = await servicioResponse.json();
                throw new Error(errorData.error || 'Error al registrar el servicio');
            }

            navigate('/recibo', { 
                state: { 
                    nombre: tipoServicio,
                    descripcion: customerInfo,
                    tamano: selectedSize,
                    imagen: file.name,
                    precio: getPrecioByTamano(selectedSize),
                    cedula_cliente: clienteData.cliente.cedula,
                    clienteData: clienteData.cliente
                } 
            });

        } catch (err) {
            setError('Error al procesar la solicitud: ' + err.message);
            console.error('Error completo:', err);
        }
    };

    const handleNoPalabraClave = () => {
        navigate('/registros');
    };

    return (
        <div style={styles.impresionOptions}>
            <h2 style={styles.title}>Selecciona el tamaño de Impresión Digital</h2>
            
            {error && (
                <div style={{ color: 'red', marginBottom: '10px' }}>
                    {error}
                </div>
            )}

            <select 
                value={selectedSize} 
                onChange={(e) => setSelectedSize(e.target.value)} 
                style={styles.select}
            >
                <option value="">Seleccione un tamaño</option>
                <option value="Impresión Digital A3">Impresión Digital A3 - $20,000</option>
                <option value="Impresión Digital A4">Impresión Digital A4 - $20,000</option>
            </select>

            <textarea
                placeholder="Nombre de establecimiento, información de contacto, servicios."
                value={customerInfo}
                onChange={(e) => setCustomerInfo(e.target.value)}
                maxLength={255}
                style={styles.textarea}
            />
            <div>
                {customerInfo.length} / 255 caracteres
            </div>

            <input 
                type="file" 
                onChange={handleFileChange} 
                style={styles.inputFile} 
            />
            
            <div>
                <input
                    type="text"
                    placeholder="Ingrese su palabra clave"
                    value={palabraClave}
                    onChange={(e) => setPalabraClave(e.target.value)}
                    style={styles.inputText}
                />
            </div>

            <div style={styles.buttonGroup}>
                <button className='button' onClick={handleNoPalabraClave}>
                    No tengo palabra clave, crear una
                </button>
                <button className="button" onClick={handleContinue}>
                    Continuar con la compra
                </button>
            </div>
        </div>
    );
};



export default ImpresionDigitalOptions;

