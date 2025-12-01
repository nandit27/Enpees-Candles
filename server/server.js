const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer setup for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_DIR);
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '_' + file.originalname.replace(/\s+/g, '_');
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

// Serve uploaded images
app.use('/uploads', express.static(UPLOADS_DIR));

const ORDERS_FILE = path.join(__dirname, 'orders.json');
const PRODUCTS_FILE = path.join(__dirname, 'products.json');

// Helper to read data
const readData = (file) => {
    if (!fs.existsSync(file)) {
        return [];
    }
    const data = fs.readFileSync(file);
    return JSON.parse(data);
};

// Helper to write data
const writeData = (file, data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// GET /api/orders
app.get('/api/orders', (req, res) => {
    try {
        const orders = readData(ORDERS_FILE);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// POST /api/orders
app.post('/api/orders', (req, res) => {
    try {
        const newOrder = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...req.body
        };
        const orders = readData(ORDERS_FILE);
        orders.push(newOrder);
        writeData(ORDERS_FILE, orders);
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// GET /api/products
app.get('/api/products', (req, res) => {
    try {
        const products = readData(PRODUCTS_FILE);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// POST /api/products
app.post('/api/products', upload.single('image'), (req, res) => {
    try {
        // If an image file was uploaded, use its URL, otherwise fall back to any image field
        const imageUrl = req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : req.body.image;

        const productData = {
            ...req.body,
            image: imageUrl
        };

        const newProduct = {
            id: Date.now().toString(),
            ...productData
        };
        const products = readData(PRODUCTS_FILE);
        products.push(newProduct);
        writeData(PRODUCTS_FILE, products);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// PATCH /api/products/:id - Update product (e.g., featured status)
app.patch('/api/products/:id', (req, res) => {
    try {
        const productId = req.params.id;
        const updates = req.body;

        const products = readData(PRODUCTS_FILE);
        const productIndex = products.findIndex(p => p.id === productId);

        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }

        products[productIndex] = { ...products[productIndex], ...updates };
        writeData(PRODUCTS_FILE, products);
        res.json(products[productIndex]);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// DELETE /api/products/:id - Delete product
app.delete('/api/products/:id', (req, res) => {
    try {
        const productId = req.params.id;
        let products = readData(PRODUCTS_FILE);
        const initialLength = products.length;

        products = products.filter(p => p.id !== productId);

        if (products.length === initialLength) {
            return res.status(404).json({ error: 'Product not found' });
        }

        writeData(PRODUCTS_FILE, products);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

const INQUIRIES_FILE = path.join(__dirname, 'inquiries.json');

// GET /api/inquiries - Get all inquiries (for admin)
app.get('/api/inquiries', (req, res) => {
    try {
        const inquiries = readData(INQUIRIES_FILE);
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch inquiries' });
    }
});

// POST /api/inquiries/general - Submit general contact inquiry
app.post('/api/inquiries/general', (req, res) => {
    try {
        const newInquiry = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...req.body
        };
        const inquiries = readData(INQUIRIES_FILE);
        inquiries.general.push(newInquiry);
        writeData(INQUIRIES_FILE, inquiries);
        res.status(201).json({ message: 'General inquiry submitted successfully', inquiry: newInquiry });
    } catch (error) {
        console.error('Error submitting general inquiry:', error);
        res.status(500).json({ error: 'Failed to submit inquiry' });
    }
});

// POST /api/inquiries/trade - Submit trade inquiry
app.post('/api/inquiries/trade', (req, res) => {
    try {
        const newInquiry = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...req.body
        };
        const inquiries = readData(INQUIRIES_FILE);
        inquiries.trade.push(newInquiry);
        writeData(INQUIRIES_FILE, inquiries);
        res.status(201).json({ message: 'Trade inquiry submitted successfully', inquiry: newInquiry });
    } catch (error) {
        console.error('Error submitting trade inquiry:', error);
        res.status(500).json({ error: 'Failed to submit inquiry' });
    }
});

// POST /api/inquiries/bulk - Submit bulk order inquiry
app.post('/api/inquiries/bulk', (req, res) => {
    try {
        // Validate total quantity from items or direct quantity field
        const totalQuantity = req.body.totalQuantity || parseInt(req.body.quantity) || 0;

        if (totalQuantity <= 100) {
            return res.status(400).json({ error: 'Total quantity must be more than 100 pieces' });
        }

        const newInquiry = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...req.body
        };
        const inquiries = readData(INQUIRIES_FILE);
        inquiries.bulk.push(newInquiry);
        writeData(INQUIRIES_FILE, inquiries);
        res.status(201).json({ message: 'Bulk order inquiry submitted successfully', inquiry: newInquiry });
    } catch (error) {
        console.error('Error submitting bulk order inquiry:', error);
        res.status(500).json({ error: 'Failed to submit inquiry' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
