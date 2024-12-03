import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VolantesOptions = ({ onBack, onContinue }) => {
    const [selectedSize, setSelectedSize] = useState('');
    const [customerInfo, setCustomerInfo] = useState('');
    const [file, setFile] = useState(null);
    const [palabraClave, setPalabraClave] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [tipoServicio] = useState('Volante');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const getPrecioByTamano = (tamano) => {
        const precios = {
            'Volantes 4x0': 145000,
            'Volantes 4x1': 175000,
            'Volantes 4x2': 220000
        };
        return precios[tamano] || 0;
    };

    const handleContinue = async () => {
        if (!selectedSize) {
            setError('Por favor, seleccione un tamaño de volante.');
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

            console.log('Enviando datos del servicio:', servicioData);

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
        <div style={styles.volantesOptions}>
            <h2 style={styles.title}>Selecciona el tamaño para los Volantes</h2>
            
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
                <option value="Volantes 4x0">Volantes 4x0 - Impresión un solo lado a color - $145,000</option>
                <option value="Volantes 4x1">Volantes 4x1 - Parte frontal a color y respaldo en escala de grises - $175,000</option>
                <option value="Volantes 4x2">Volantes 4x2 - Ambos lados a color - $220,000</option>
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

const styles = {
    volantesOptions: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        margin: '20px',
    },
    title: {
        marginBottom: '20px',
        color: '#b71c1c',
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'left',
        width: '100%',
    },
    select: { 
        margin: '10px 0',
        padding: '10px',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
    },
    textarea: {
        height: '100px',
        margin: '10px 0',
        padding: '10px',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
    },
    inputFile: {
        margin: '10px 0',
        padding: '10px',
        width: '100%',
        maxWidth: '400px',
    },
    inputText: {
        margin: '10px 0',
        padding: '10px',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
        gap: '15px',
    },
};

export default VolantesOptions;
