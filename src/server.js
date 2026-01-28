import express from 'express';
import Handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Routers
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerce');

// Handlebars
app.engine('handlebars', Handlebars.engine({
    extname: '.handlebars',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos css
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
    res.redirect('/products/views');
});

// Rutas
app.use('/api/products', productsRouter);  
app.use('/api/carts', cartsRouter);  
app.use('/products', productsRouter);     
app.use('/carts', cartsRouter);           

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});