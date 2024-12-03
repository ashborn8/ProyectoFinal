import React, { useState } from 'react';

import PostOptions from './PostOptions.jsx';
import DiseñoLogoOptions from './DiseñoLogoOptions.jsx';
import DiseñoImpresionOptions from './DiseñoImpresionOptions.jsx';

import LogoImpresion from '/LogoImpresion.jpeg'
import LogoEmprendedor from '/LogoEmprendedor.jpeg';
import LogoEmpresa from '/LogoEmpresa.jpeg';
import LogoNegocio from '/LogoNegocio.jpeg';
import Post from '/Post.jpeg';

import Modal from './Modal.jsx';

const servicios = {
  Diseño: {
    Post: [
      { name: 'Post', description: 'Ingrese la información que considere necesaria para su respectivo diseño', price: 20000, image: Post }
    ],
    DiseñoLogos: [
      {name: 'Logo Negocios Pequeños', description: 'Diseño de logos para negocio pequeño legalmente constituido', price: 200000, image: LogoEmpresa},
      {name: 'Logo para Emprendedores', description: 'Diseño de logo para emprendedores', price: 450000, image: LogoEmprendedor},
      {name: 'Logo para Empresas', description: 'Diseño de logo para empresas con manual de marca (Garantia de cambios y correcciones por 30 dias despues de la entrega) ', price: 500000, image: LogoNegocio}
    ],
    DiseñoImpresion: [
      {name: 'Diseño Impresion', description: 'Impresiones de 1 a 5 unidades $15.000  a partir de 6 diseños 10.000.', price: 15000, image: LogoImpresion}
    ]
  },
};

const DisenoGrafico = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [productos, setProductos] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setProductos(servicios.Diseño[service]);
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
      <section id="diseno-grafico" className="service-section">
        <h2>Productos de Diseño Gráfico</h2>
        <ul className="product-submenu">
          <li><a href="#" onClick={() => handleServiceSelect('Post')}>Post</a></li>
          <li><a href="#" onClick={() => handleServiceSelect('DiseñoLogos')}>Diseño de Logos</a></li>
          <li><a href="#" onClick={() => handleServiceSelect('DiseñoImpresion')}>Diseño de Impresion</a></li>

        </ul>
        <div className="products-container">
          {renderizarProductos()}
        </div>
      </section>

      {showOptions && selectedProduct && (
        <Modal onClose={() => setShowOptions(false)}>
          {selectedService === 'Post' && <PostOptions onContinue={handleContinue} />}
          {selectedService === 'DiseñoLogos' && <DiseñoLogoOptions onContinue={handleContinue} />}
          {selectedService === 'DiseñoImpresion' && <DiseñoImpresionOptions onContinue={handleContinue} />}
        </Modal>
      )}
    </>
  );
};

export default DisenoGrafico;