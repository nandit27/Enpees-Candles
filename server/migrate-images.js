require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const BACKEND_URL = 'https://enpees-candles.vercel.app';

async function updateProductImages() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const products = await Product.find({});
        console.log(`Found ${products.length} products`);

        for (const product of products) {
            if (product.image && product.image.includes('/src/assets/')) {
                // Extract filename from /src/assets/filename.webp
                const filename = product.image.split('/').pop();
                const newImageUrl = `${BACKEND_URL}/products/${filename}`;
                
                await Product.updateOne(
                    { _id: product._id },
                    { $set: { image: newImageUrl } }
                );
                
                console.log(`Updated ${product.name}: ${product.image} -> ${newImageUrl}`);
            }
        }

        console.log('✅ Migration complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

updateProductImages();
