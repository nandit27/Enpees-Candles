const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
});

// Email templates
const emailTemplates = {
    orderPlaced: (orderData) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #EAD2C0; border-radius: 10px; background-color: #FFF7ED;">
            <h2 style="color: #3B2A23; text-align: center;">Order Placed Successfully! 🎉</h2>
            <p style="color: #554B47;">Dear ${orderData.customerName},</p>
            <p style="color: #554B47;">Thank you for your order! We've received it and will process it shortly.</p>
            
            <div style="background-color: #D8A24A; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #3B2A23; margin: 0;">Order ID: ${orderData.orderId}</h3>
                <p style="color: #3B2A23; margin: 5px 0;">Total Amount: ₹${orderData.total}</p>
            </div>
            
            <h3 style="color: #3B2A23;">Order Items:</h3>
            <ul style="color: #554B47;">
                ${orderData.items.map(item => `
                    <li>${item.name} x ${item.quantity} - ₹${item.price}</li>
                `).join('')}
            </ul>
            
            <p style="color: #554B47;">We'll send you an email once your order is confirmed by our team.</p>
            <p style="color: #554B47; margin-top: 30px;">Best regards,<br><strong>Enpees Candles Team</strong></p>
        </div>
    `,
    
    orderConfirmed: (orderData) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #EAD2C0; border-radius: 10px; background-color: #FFF7ED;">
            <h2 style="color: #3B2A23; text-align: center;">Order Confirmed! ✅</h2>
            <p style="color: #554B47;">Dear ${orderData.customerName},</p>
            <p style="color: #554B47;">Great news! Your order has been confirmed and is being prepared for shipment.</p>
            
            <div style="background-color: #D8A24A; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #3B2A23; margin: 0;">Order ID: ${orderData.orderId}</h3>
                <p style="color: #3B2A23; margin: 5px 0;">Status: Confirmed</p>
            </div>
            
            <p style="color: #554B47;">You'll receive another email with tracking details once your order is shipped.</p>
            
            <p style="color: #554B47; margin-top: 30px;">Best regards,<br><strong>Enpees Candles Team</strong></p>
        </div>
    `,
    
    orderShipped: (orderData) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #EAD2C0; border-radius: 10px; background-color: #FFF7ED;">
            <h2 style="color: #3B2A23; text-align: center;">Order Shipped! 🚚</h2>
            <p style="color: #554B47;">Dear ${orderData.customerName},</p>
            <p style="color: #554B47;">Your order is on its way! You can track your shipment using the details below.</p>
            
            <div style="background-color: #D8A24A; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #3B2A23; margin: 0;">Order ID: ${orderData.orderId}</h3>
                <p style="color: #3B2A23; margin: 5px 0;">Tracking ID: ${orderData.trackingId}</p>
                ${orderData.trackingLink ? `<a href="${orderData.trackingLink}" style="color: #3B2A23; text-decoration: underline;">Track Your Order</a>` : ''}
            </div>
            
            <p style="color: #554B47;">Your order should arrive within 5-7 business days.</p>
            <p style="color: #554B47;">If you have any questions, feel free to contact us.</p>
            
            <p style="color: #554B47; margin-top: 30px;">Best regards,<br><strong>Enpees Candles Team</strong></p>
        </div>
    `,
    
    orderCancelled: (orderData) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #EAD2C0; border-radius: 10px; background-color: #FFF7ED;">
            <h2 style="color: #3B2A23; text-align: center;">Order Cancelled ❌</h2>
            <p style="color: #554B47;">Dear ${orderData.customerName},</p>
            <p style="color: #554B47;">Your order has been cancelled as per your request or due to unforeseen circumstances.</p>
            
            <div style="background-color: #FFE5E5; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #FF6B6B;">
                <h3 style="color: #3B2A23; margin: 0;">Order ID: ${orderData.orderId}</h3>
                <p style="color: #3B2A23; margin: 5px 0;">Status: Cancelled</p>
                ${orderData.reason ? `<p style="color: #554B47; margin: 5px 0;">Reason: ${orderData.reason}</p>` : ''}
            </div>
            
            <p style="color: #554B47;">If you have any questions or concerns, please don't hesitate to contact us.</p>
            <p style="color: #554B47;">We hope to serve you again in the future!</p>
            
            <p style="color: #554B47; margin-top: 30px;">Best regards,<br><strong>Enpees Candles Team</strong></p>
        </div>
    `,
    
    orderDelivered: (orderData) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #EAD2C0; border-radius: 10px; background-color: #FFF7ED;">
            <h2 style="color: #3B2A23; text-align: center;">Order Delivered! 🎁</h2>
            <p style="color: #554B47;">Dear ${orderData.customerName},</p>
            <p style="color: #554B47;">Great news! Your order has been successfully delivered.</p>
            
            <div style="background-color: #D8A24A; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #3B2A23; margin: 0;">Order ID: ${orderData.orderId}</h3>
                <p style="color: #3B2A23; margin: 5px 0;">Status: Delivered</p>
            </div>
            
            <p style="color: #554B47;">We hope you love your candles! If you have any questions or feedback, please let us know.</p>
            <p style="color: #554B47;">Thank you for choosing Enpees Candles!</p>
            
            <p style="color: #554B47; margin-top: 30px;">Best regards,<br><strong>Enpees Candles Team</strong></p>
        </div>
    `,

    partialOrder: (orderData) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #EAD2C0; border-radius: 10px; background-color: #FFF7ED;">
            <h2 style="color: #3B2A23; text-align: center;">Partial Order Update 📦</h2>
            <p style="color: #554B47;">Dear ${orderData.customerName},</p>
            <p style="color: #554B47;">We wanted to inform you about your order status.</p>
            
            <div style="background-color: #D8A24A; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #3B2A23; margin: 0;">Order ID: ${orderData.orderId}</h3>
                <p style="color: #3B2A23; margin: 5px 0;">Status: Partial Order - Confirmed</p>
            </div>
            
            <div style="background-color: #f0ad4e; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #3B2A23; margin-top: 0;">⚠️ Important Notice</h3>
                <p style="color: #3B2A23; margin: 5px 0;">Some items from your order are currently unavailable and will not be shipped.</p>
            </div>

            <h3 style="color: #3B2A23;">Items NOT Available (Will Not Be Shipped):</h3>
            <ul style="color: #d9534f; background-color: #f2dede; padding: 15px; border-radius: 5px;">
                ${orderData.unavailableItems.map(item => `
                    <li><strong>${item.name}</strong> x ${item.quantity} - Color: ${item.color}, Fragrance: ${item.fragrance}</li>
                `).join('')}
            </ul>

            <h3 style="color: #3B2A23;">Items That WILL Be Shipped:</h3>
            <ul style="color: #5cb85c; background-color: #dff0d8; padding: 15px; border-radius: 5px;">
                ${orderData.availableItems.map(item => `
                    <li><strong>${item.name}</strong> x ${item.quantity} - Color: ${item.color}, Fragrance: ${item.fragrance}</li>
                `).join('')}
            </ul>
            
            <p style="color: #554B47;">We sincerely apologize for any inconvenience. The available items have been confirmed and will be shipped to you soon.</p>
            <p style="color: #554B47;">You'll receive tracking details once your partial order is shipped.</p>
            
            <div style="background-color: #d9edf7; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #5bc0de;">
                <h3 style="color: #31708f; margin-top: 0;">💰 Refund Information</h3>
                <p style="color: #31708f; margin: 5px 0; font-size: 18px;"><strong>Refund Amount: ₹${orderData.refundAmount?.toFixed(2) || '0.00'}</strong></p>
                <p style="color: #31708f; margin: 5px 0;">Refund for unavailable items will be initiated within 3-6 business days to your original payment method.</p>
            </div>
            
            <p style="color: #554B47;">If you have any questions or concerns, please don't hesitate to contact us.</p>
            
            <p style="color: #554B47; margin-top: 30px;">Best regards,<br><strong>Enpees Candles Team</strong></p>
        </div>
    `
};

// Send email function
const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: `"Enpees Candles" <${process.env.EMAIL_USER || 'your-email@gmail.com'}>`,
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};

// Exported mail service functions
const mailService = {
    sendOrderPlacedMail: async (orderData) => {
        const html = emailTemplates.orderPlaced(orderData);
        return await sendEmail(
            orderData.customerEmail,
            `Order Placed - ${orderData.orderId}`,
            html
        );
    },

    sendOrderConfirmedMail: async (orderData) => {
        const html = emailTemplates.orderConfirmed(orderData);
        return await sendEmail(
            orderData.customerEmail,
            `Order Confirmed - ${orderData.orderId}`,
            html
        );
    },

    sendOrderShippedMail: async (orderData) => {
        const html = emailTemplates.orderShipped(orderData);
        return await sendEmail(
            orderData.customerEmail,
            `Order Shipped - ${orderData.orderId}`,
            html
        );
    },

    sendOrderCancelledMail: async (orderData) => {
        const html = emailTemplates.orderCancelled(orderData);
        return await sendEmail(
            orderData.customerEmail,
            `Order Cancelled - ${orderData.orderId}`,
            html
        );
    },

    sendOrderDeliveredMail: async (orderData) => {
        const html = emailTemplates.orderDelivered(orderData);
        return await sendEmail(
            orderData.customerEmail,
            `Order Delivered - ${orderData.orderId}`,
            html
        );
    },

    sendPartialOrderMail: async (orderData) => {
        const html = emailTemplates.partialOrder(orderData);
        return await sendEmail(
            orderData.customerEmail,
            `Partial Order Update - ${orderData.orderId}`,
            html
        );
    }
};

module.exports = mailService;
