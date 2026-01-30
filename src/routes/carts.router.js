import { Router } from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = Router();

-

// vista de un carrito específico para Handlebars 
router.get('/views', async (req, res) => {
    try {
        const cart = await Cart.findOne().sort({ createdAt: -1 }).populate('products.product').lean();

        if (!cart || cart.products.length === 0) {
            return res.render('cart', {
                isEmpty: true,
                products: [],
                subtotal: 0,
                total: 0
            });
        }

        const subtotal = cart.products.reduce((sum, item) => {
            
            const price = item.product ? item.product.price : 0;
            return sum + (price * item.quantity);
        }, 0);

        res.render('cart', {
            isEmpty: false,
            products: cart.products,
            subtotal,
            total: subtotal
        });
    } catch (error) {
        console.error('Error en vista de carrito:', error);
        res.status(500).send('Error al cargar el carrito');
    }
});

// obtener todos los carritos con populate (API)
router.get('/', async (req, res) => {
    try {
        const carts = await Cart.find().populate('products.product');
        res.json({ status: 'success', payload: carts });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = new Cart({ products: [] });
        await newCart.save();
        res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});



// obtener un carrito por ID con populate
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid.trim()).populate('products.product');

        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// agregar un producto al carrito.
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const product = await Product.findById(pid.trim());
        if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

        const cart = await Cart.findById(cid.trim());
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        const existingProductIndex = cart.products.findIndex(item => item.product.toString().trim() === pid.trim());

        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += 1;
        } else {
            cart.products.push({ product: pid.trim(), quantity: 1 });
        }

        await cart.save();
        res.json({ status: 'success', message: 'Producto agregado', cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// eliminar un producto específico del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid.trim());
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        cart.products = cart.products.filter(item => item.product.toString().trim() !== pid.trim());
        
        await cart.save();
        res.json({ status: 'success', message: 'Producto eliminado del carrito' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// actualizar carrito con un arreglo de productos completo
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;

        if (!Array.isArray(products)) {
            return res.status(400).json({ status: 'error', message: 'Debe enviar un array de productos' });
        }

        const updatedCart = await Cart.findByIdAndUpdate(
            cid.trim(),
            { products },
            { new: true }
        ).populate('products.product');

        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// actualizar solo la cantidad de un producto específico
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!quantity || isNaN(quantity)) return res.status(400).json({ status: 'error', message: 'Cantidad inválida' });

        const cart = await Cart.findById(cid.trim());
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        const productIndex = cart.products.findIndex(p => p.product.toString().trim() === pid.trim());

        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();
            res.json({ status: 'success', message: 'Cantidad actualizada' });
        } else {
            res.status(404).json({ status: 'error', message: 'Producto no encontrado en carrito' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// eliminar todos los productos del carrito 
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findByIdAndUpdate(cid.trim(), { products: [] }, { new: true });
        
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        res.json({ status: 'success', message: 'Carrito vaciado' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;