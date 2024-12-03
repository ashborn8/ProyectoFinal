import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { Pool } = pg;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'prueba',
  password: 'junsy',
  port: 5432,
});

pool.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.stack);
  } else {
    console.log('Conectado a la base de datos');
  }
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error al ejecutar la consulta:', err.stack);
  } 
});

app.post('/api/registrar-cliente', async (req, res) => {
    const { cedula, nombre, telefono, direccion, barrio, palabra_clave, id_ciudad,  apellido } = req.body;
  
    try {
      const result = await pool.query(
        'INSERT INTO cliente (cedula, nombre, telefono, direccion, barrio, palabra_clave, id_ciudad, apellido) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [cedula, nombre, telefono, direccion, barrio, palabra_clave, id_ciudad, apellido]
      );
  
      res.status(201).json({ message: 'Cliente registrado con éxito', user: result.rows[0] });
    } catch (error) {
      console.error('Error al registrar el cliente:', error);
      res.status(500).json({ message: 'Error al registrar el cliente', details: error.message });
    }
  });

app.post('/api/registrar-usuario', async (req, res) => {
  const { cedula, nombre, apellido} = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO usuario (cedula, nombre, apellido) VALUES ($1, $2, $3) RETURNING *',
      [cedula, nombre, apellido]
    );

    res.status(201).json({ message: 'Usuario registrado con éxito', user: result.rows[0] });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
});

app.post('/api/iniciar-sesion', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT cedula, nombre, apellido FROM usuario WHERE nombre = $1 AND cedula = $2',
      [username, password]
    );

    if (result.rows.length > 0) {
      const usuario = result.rows[0];
      console.log('Usuario encontrado:', usuario);

      res.status(200).json({ 
        user: { 
          cedula: usuario.cedula, 
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          nombreCompleto: `${usuario.nombre} ${usuario.apellido}`
        } 
      });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.get('/api/cliente/:cedula', async (req, res) => {
  const { cedula } = req.params;
  
  console.log('Buscando cliente con cédula:', cedula); // Debug log

  try {
    const result = await pool.query(
      'SELECT nombre, apellido, cedula FROM cliente WHERE cedula = $1',
      [cedula]
    );

   

    if (result.rows.length > 0) {
      const cliente = result.rows[0];
      const response = { 
        cliente: {
          cedula: cliente.cedula,
          nombre: `${cliente.nombre} ${cliente.apellido}`
        }
      };
      
      console.log('Enviando respuesta:', response); 
      res.status(200).json(response);
    } else {
      console.log('Cliente no encontrado para cédula:', cedula); 
      res.status(404).json({ message: 'Cliente no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener datos del cliente:', error);
    res.status(500).json({ 
      message: 'Error al obtener datos del cliente',
      error: error.message 
    });
  }
});

app.post('/api/verificar-palabra-clave', async (req, res) => {
  const { cedula, palabraClave } = req.body;

  try {
    const result = await pool.query(
      'SELECT palabra_clave FROM cliente WHERE cedula = $1',
      [cedula]
    );

    if (result.rows.length > 0 && result.rows[0].palabra_clave === palabraClave) {
      res.status(200).json({ valid: true });
    } else {
      res.status(200).json({ valid: false });
    }
  } catch (error) {
    console.error('Error al verificar palabra clave:', error);
    res.status(500).json({ message: 'Error al verificar palabra clave' });
  }
});

app.get('/api/cliente/por-palabra-clave/:palabraClave', async (req, res) => {
  const { palabraClave } = req.params;

  try {
    const result = await pool.query(
      'SELECT nombre, apellido, cedula FROM cliente WHERE palabra_clave = $1',
      [palabraClave]
    );

    if (result.rows.length > 0) {
      const cliente = result.rows[0];
      res.status(200).json({
        cliente: {
          cedula: cliente.cedula,
          nombre: `${cliente.nombre} ${cliente.apellido}`
        }
      });
    } else {
      res.status(404).json({ message: 'Cliente no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener datos del cliente:', error);
    res.status(500).json({ message: 'Error al obtener datos del cliente', error: error.message });
  }
});


app.post('/api/registrar-servicio', async (req, res) => {
  const {
    nombre,
    descripcion,
    tamano,
    imagen, 
    precio,
    cedula_cliente
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO servicios 
       (nombre, descripcion, tamano, imagen, precio, cedula_cliente) 
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [nombre, descripcion, tamano, imagen, precio, cedula_cliente]
    );

    res.status(201).json({ 
      message: 'Servicio registrado con éxito', 
      servicio: result.rows[0] 
    });
  } catch (error) {
    console.error('Error al registrar el servicio:', error);
    res.status(500).json({ 
      message: 'Error al registrar el servicio', 
      error: error.message 
    });
  }
});

app.use((err, req, res, next) => {
  console.error('Error en el servidor:', err); 
  res.status(500).json({ error: 'Error interno del servidor', details: err.message });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});

const handleLogout = () => {
  localStorage.removeItem('userName');
  localStorage.removeItem('userCedula');
};