const express = require('express');
const cors = require('cors');
const mongoConnect = require('./config/db');

//Creación del servidor
const app = express();

//Conexión a la base de datos MongoDB
mongoConnect();

//Habilitar cors
app.use(cors());

//Habilitar express.json
app.use(express.json({ extended: true }));

//Definición del puerto del servidor
const PORT = process.env.PORT || 4000;

//Importar rutas de la API
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));

//Arrancar la APP
app.listen(PORT, () => {
    console.log(`El servidor se inició en el puerto ${PORT}`);
})