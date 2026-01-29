import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

// get con paginación, filtrado y ordenamiento
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, query = '', sort = '' } = req.query;

        let filter = {};
        if (query) {
            if (query === 'true' || query === 'false') {
                filter.status = query === 'true';
            } else {
                filter.category = query;
            }
        }

        const sortOption = {};
        if (sort === 'asc') sortOption.price = 1;
        else if (sort === 'desc') sortOption.price = -1;

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sortOption,
            lean: true
        };

        const result = await Product.paginate(filter, options);

        // agregar links prev y next
        const baseUrl = `${req.protocol}://${req.get('host')}/api/products`;
        const buildLink = (p) => {
            const params = new URLSearchParams({ ...req.query, page: p }).toString();
            return `${baseUrl}?${params}`;
        };

        res.json({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
            nextLink: result.hasNextPage ? buildLink(result.nextPage) : null
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// renderizador de handlebars main para productos
router.get('/views', async (req, res) => {
    try {
        const { limit = 10, page = 1, query = '', sort = '' } = req.query;

        let filter = {};
        if (query) {
            if (query === 'true' || query === 'false') {
                filter.status = query === 'true';
            } else {
                filter.category = query;
            }
        }

        const sortOption = {};
        if (sort === 'asc') sortOption.price = 1;
        else if (sort === 'desc') sortOption.price = -1;

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sortOption,
            lean: true
        };

        const result = await Product.paginate(filter, options);

        // para ver si hay stock
        const productsWithStockStatus = result.docs.map(product => ({
            ...product,
            isAvailable: product.stock > 0
        }));

        // Para las vistas de handlebars
        res.render('products', {
            payload: productsWithStockStatus,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage
                ? `/products/views?limit=${limit}&page=${result.prevPage}&query=${query}&sort=${sort}`
                : null,
            nextLink: result.hasNextPage
                ? `/products/views?limit=${limit}&page=${result.nextPage}&query=${query}&sort=${sort}`
                : null,
            query,
            sort,
            limit
        });
    } catch (error) {
        res.status(500).send('Error al cargar productos');
    }
});

// renderizado de detalle de producto  
router.get('/views/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await Product.findById(pid);
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }

        const productWithStock = {
            ...product.toObject(),
            isAvailable: product.stock > 0
        };

        res.render('productDetail', { product: productWithStock });
    } catch (error) {
        res.status(500).send('Error al cargar el producto');
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await Product.findById(pid);

        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }

        res.json({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Ruta para crear un nuevo producto (La que usaremos en Postman)
router.post('/', async (req, res) => {
    try {
        const newProduct = req.body;
        
        const result = await Product.create(newProduct);

        res.status(201).json({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;