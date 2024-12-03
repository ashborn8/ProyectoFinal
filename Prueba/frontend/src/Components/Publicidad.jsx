import React, { useState } from 'react';


import PendonM from '/PendonM.jpeg';
import PendonS from '/PendonS.jpeg';
import PendonL from '/PendonL.jpeg';
import PendonXL from '/PendonXL.jpeg';

import Tarjetas4x1 from '/Tarjetas4x1.jpeg';
import Tarjetas4x4 from '/Tarjetas4x4.jpg';
import Tarjeta4x4UV from '/Tarjetas4x4UV.jpeg';


import Volante4x1 from '/volante4x1.jpeg';
import Volante4x0 from '/volantes4x0.jpeg';
import Volante4x4 from '/volante4x4.jpeg';

import StickerP from '/Sticker.jpg';
import StickerGrande from '/StickerGrande.jpeg'

import Banner from '/Banner.jpeg';
import Vinilo from '/Vinilo.jpeg';


import PendonesOptions from './PendonesOptions';
import TarjetasOptions from './TarjetasOptions';
import VolantesOptions from './VolantesOptions';
import ImpresionDigitalOptions from './ImpresionDigitalOptions';
import StickersOptions from './StickersOptions';
import Modal from './Modal';

// Simulación de productos
const servicios = {
  publicidad: {
    pendones: [
      { name: 'Pendón talla S', description: 'Pendón de 50 Cm x 70 Cm', price: 28000, image: PendonS },
      { name: 'Pendón talla M', description: 'Pendón de 70 Cm x 100 Cm', price: 42000, image: PendonM },
      { name: 'Pendón talla L', description: 'Pendón de 80 Cm x 120 Cm', price: 67000, image: PendonL },
      { name: 'Pendón talla XL', description: 'Pendón de 100 Cm x 150 Cm', price: 90000, image: PendonXL }
    ],
    tarjetas: [
      { name: 'Tarjetas Barniz 4*1', description: '1000 Parte frontal full color barnizada / respaldo blanco y negro', price: 80000, image: Tarjetas4x1 },
      { name: 'Tarjetas Barniz 4*1 Mate UV', description: 'Parte frontal a color Mate con Brillo UV parcial y respaldo en escala de grises', price: 120000, image: Tarjeta4x4UV },
      { name: 'Tarjetas Barniz 4*4', description: 'Ambos lados a color mate con brillo UV parcial', price: 150000, image: Tarjetas4x4 }
    ],
    volantes: [
      { name: 'Volantes 4x0', description: 'Impresión un solo lado a color', price: 145000, image: Volante4x0 },
      { name: 'Volantes 4x1', description: 'Parte frontal a color y respaldo en escala de grises', price: 175000, image: Volante4x1 },
      { name: 'Volantes 4x2', description: 'Ambos lados a color', price: 220000, image: Volante4x4 }
    ],
    stickers: [
      { name: 'Sticker pequeño', description: 'Sticker de 5 cm', price: 5000, image: StickerP },
      { name: 'Sticker grande', description: 'Sticker de 10 cm', price: 10000, image: StickerGrande },
    ],
    impresionDigital: [
      { name: 'Impresión Digital A3', description: 'Material - Vinilo adhesivo', price: 20000, image: Vinilo },
      { name: 'Impresión Digital A4', description: 'Material - Banner', price: 20000, image: Banner }
    ]
  }
};

const Publicidad = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [productos, setProductos] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setProductos(servicios.publicidad[service]);
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
      <section id="publicidad" className="service-section">
        <h2>Productos de Publicidad</h2>
          <ul className="product-submenu">
            <li><a href="#" onClick={() => handleServiceSelect('pendones')}>Pendones</a></li>
            <li><a href="#" onClick={() => handleServiceSelect('tarjetas')}>Tarjetas</a></li>
            <li><a href="#" onClick={() => handleServiceSelect('volantes')}>Volantes</a></li>
            <li><a href="#" onClick={() => handleServiceSelect('impresionDigital')}>Impresión Digital</a></li>
            <li><a href="#" onClick={() => handleServiceSelect('stickers')}>Stickers</a></li>
          </ul>
        <div className="products-container">
          {renderizarProductos()}
        </div>
      </section>

      {showOptions && selectedProduct && (
        <Modal onClose={() => setShowOptions(false)}>
          {selectedService === 'pendones' && <PendonesOptions onContinue={handleContinue} />}
          {selectedService === 'tarjetas' && <TarjetasOptions onContinue={handleContinue} />}
          {selectedService === 'volantes' && <VolantesOptions onContinue={handleContinue} />}
          {selectedService === 'impresionDigital' && <ImpresionDigitalOptions onContinue={handleContinue} />}
          {selectedService === 'stickers' && <StickersOptions onContinue={handleContinue} />}
        </Modal>
      )}
    </>
  );
};

export default Publicidad;