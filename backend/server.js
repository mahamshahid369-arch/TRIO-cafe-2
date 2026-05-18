const express = require('express');
const cors = require('cors');
const axios = require('axios');
const admin = require('firebase-admin');

const app = express();
app.use(cors());
app.use(express.json());

// ─── Firebase Admin Init ───────────────────────────────────────────────────
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://triobymaham-8ed0c-default-rtdb.firebaseio.com"
});

const db = admin.database();

// ─── API Keys ─────────────────────────────────────────────────────────────
const WEATHER_API_KEY = '18a1b5969bf37cf9f10eaa90b4dc95e8';

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({ status: 'Trio Cafe Backend Running', version: '1.0.0' });
});

// ─── PRODUCTS ─────────────────────────────────────────────────────────────

// GET all products (optionally filtered by category)
app.get('/api/products', async (req, res) => {
    try {
        const { category } = req.query;
        const snapshot = await db.ref('products').once('value');
        let products = snapshot.val() || {};

        if (category && category !== 'all') {
            const filtered = {};
            Object.entries(products).forEach(([id, p]) => {
                if (p.category === category) filtered[id] = p;
            });
            products = filtered;
        }

        res.json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET single product
app.get('/api/products/:id', async (req, res) => {
    try {
        const snapshot = await db.ref(`products/${req.params.id}`).once('value');
        const product = snapshot.val();
        if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ─── CART ─────────────────────────────────────────────────────────────────

// GET user cart
app.get('/api/cart/:userId', async (req, res) => {
    try {
        const snapshot = await db.ref(`carts/${req.params.userId}`).once('value');
        res.json({ success: true, data: snapshot.val() || {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST add/update cart item
app.post('/api/cart/:userId/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { quantity } = req.body;

        if (quantity <= 0) {
            await db.ref(`carts/${userId}/${productId}`).remove();
        } else {
            await db.ref(`carts/${userId}/${productId}`).set(quantity);
        }

        res.json({ success: true, message: 'Cart updated' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE clear cart
app.delete('/api/cart/:userId', async (req, res) => {
    try {
        await db.ref(`carts/${req.params.userId}`).remove();
        res.json({ success: true, message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ─── ORDERS ───────────────────────────────────────────────────────────────

// POST place order
app.post('/api/orders', async (req, res) => {
    try {
        const order = req.body;
        const orderId = Date.now().toString();
        order.createdAt = Date.now();
        order.updatedAt = Date.now();
        order.status = 'processing';

        await db.ref(`orders/${orderId}`).set(order);
        await db.ref(`carts/${order.userId}`).remove();

        res.json({ success: true, orderId, message: 'Order placed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET all orders (admin)
app.get('/api/orders', async (req, res) => {
    try {
        const snapshot = await db.ref('orders').once('value');
        res.json({ success: true, data: snapshot.val() || {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ─── USERS ────────────────────────────────────────────────────────────────

// POST create user profile
app.post('/api/users', async (req, res) => {
    try {
        const { uid, name, email } = req.body;
        await db.ref(`users/${uid}`).set({ name, email, createdAt: Date.now() });
        res.json({ success: true, message: 'User profile created' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ─── WEATHER ──────────────────────────────────────────────────────────────

// GET weather for a city
app.get('/api/weather', async (req, res) => {
    try {
        const city = req.query.city || 'Lahore';
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`
        );
        res.json({ success: true, data: response.data });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Weather fetch failed' });
    }
});

// ─── QUOTES ───────────────────────────────────────────────────────────────

// GET random quote
app.get('/api/quote', async (req, res) => {
    try {
        const response = await axios.get('https://api.quotable.io/random');
        res.json({ success: true, data: response.data });
    } catch (error) {
        res.json({
            success: true,
            data: { content: 'Coffee is a language in itself.', author: 'Jackie Chan' }
        });
    }
});

// ─── START SERVER ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`✅ Trio Cafe Backend running on http://localhost:${PORT}`);
});
