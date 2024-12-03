import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const PendonesOptions = ({ onBack, onContinue, handleRegistroTipo }) => {
    const [selectedSize, setSelectedSize] = useState('');
    const [customerInfo, setCustomerInfo] = useState('');
    const [file, setFile] = useState(null);
    const [palabraClave, setPalabraClave] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); 
    const [tipoServicio] = useState('Pendón');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const getPrecioByTamano = (tamano) => {
        const precios = {
            '50x70': 28000,
            '100x70': 42000,
            '120x80': 67000,
            '100x150': 90000
        };
        return precios[tamano] || 0;
    };

    const handleContinue = async () => {
        if (!selectedSize) {
            setError('Por favor, seleccione un tamaño de pendón.');
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
        navigate('/registros'); // Cambia esto a la ruta correcta
    };

    return (
        <>
            <div style={styles.pendonesOptions}>
                {error && (
                    <div className="container">
                        <div className="overlay">
                            <p className="confirmation-card">{error}</p>
                            <button className='button'
                                onClick={() => setError('')}
                            
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                )}

                <h2 style={styles.title}>Selecciona el tamaño del Pendón</h2>
                <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} style={styles.select}>
                    <option value="">Seleccione un tamaño</option>
                    <option value="50x70">50x70 cm - $28,000</option>
                    <option value="100x70">100x70 cm - $42,000</option>
                    <option value="120x80">120x80 cm - $67,000</option>
                    <option value="100x150">100x150 cm - $90,000</option>
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

                <input type="file" onChange={handleFileChange} style={styles.inputFile} />
                <div>
                    <input
                        type="text"
                        placeholder="Ingrese su palabra clave"
                        value={palabraClave}
                        onChange={(e) => setPalabraClave(e.target.value)}
                        title="Ingrese su palabra clave para verificar si está registrado en el sistema"
                        style={styles.inputText}
                       
                    />
                </div>

                <div style={styles.buttonGroup}>
                    <button className='button' onClick={handleNoPalabraClave}>No tengo palabra clave, crear una</button>
                    <button className="button" onClick={handleContinue}>Continuar con la compra</button>
                </div>
            </div>
        </>
    );
};

const styles = {
    pendonesOptions: {
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

export default PendonesOptions;
