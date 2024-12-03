import React, { useState } from 'react';

import SinAnuncio from '/SinAnuncio.jpeg';
import ConAnuncio from '/ConAnuncio.jpeg';
import MarketingAnunciosOptions from './MarketingAnunciosOptions';

import Modal from './Modal'

const servicios = {
  MarketingDigital: {
    MarketingAnuncios: [
      {name: 'Marketing sin Anuncios', description: '7 días 8 post - 15 días 18 post + fotos que el cliente suministre', price: 270000, image: SinAnuncio},
      {name: 'Marketing con Anuncios', description: '7 días carrusel - 15 días carrusel - 30 días total 40 archivos (imágenes)', price: 650000, image: ConAnuncio}, 
    ]
  }
};

const MarketingDigital = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [productos, setProductos] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setProductos(servicios.MarketingDigital[service]);
    setShowOptions(false); // Resetea la opción de mostrar el formulario
  };

  const handleProductClick = (producto) => {
    setSelectedProduct(producto);
    setShowOptions(true); // Muestra el formulario al seleccionar un producto
  };

  const handleContinue = (data) => {
    console.log('Datos para continuar:', data);
    // Aquí puedes agregar la lógica para procesar la compra o enviar los datos a un servidor
    setShowOptions(false); // Cierra el modal después de continuar
  };

  const renderizarProductos = () => {
    return productos.map((producto, index) => (
      <div key={index} className="product" onClick={() => handleProductClick(producto)}>
        <img src={producto.image} alt={producto.name} className="product-image" />
        <h3>{producto.name}</h3>
        <p>{producto.description}</p>
        <p>Precio: ${producto.price}</p>
      </div>
    ));
  };

  return (
    <>
      <section id="marketing-digital" className="service-section">
        <h2>Productos de Marketing Digital</h2>
        <ul className="product-submenu">
          <li><a href="#" onClick={() => handleServiceSelect('MarketingAnuncios')}>Marketing Anuncios</a></li>
        </ul>
        <div className="products-container">
          {renderizarProductos()}
        </div>
      </section>

      {showOptions && selectedProduct && (
        <Modal onClose={() => setShowOptions(false)}>
          {selectedService === 'MarketingAnuncios' && <MarketingAnunciosOptions onContinue={handleContinue} />}
        </Modal>
      )}
    </>
  );
};


export default MarketingDigital;