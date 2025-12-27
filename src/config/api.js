// API Configuration
// Uses environment variable or defaults to localhost for development
// Production URL: https://enpees-candles.vercel.app/api
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const API_ENDPOINTS = {
    // Auth
    LOGIN: `${API_BASE_URL}/auth/login`,
    SIGNUP: `${API_BASE_URL}/auth/register`,
    AUTH_ME: `${API_BASE_URL}/auth/me`,
    SAVE_ADDRESS: `${API_BASE_URL}/auth/save-address`,
    UPDATE_ADDRESS: (addressId) => `${API_BASE_URL}/auth/addresses/${addressId}`,
    DELETE_ADDRESS: (addressId) => `${API_BASE_URL}/auth/addresses/${addressId}`,
    
    // Products
    PRODUCTS: `${API_BASE_URL}/products`,
    PRODUCT_BY_ID: (id) => `${API_BASE_URL}/products/${id}`,
    
    // Categories
    CATEGORIES: `${API_BASE_URL}/categories`,
    CATEGORY_BY_ID: (id) => `${API_BASE_URL}/categories/${id}`,
    
    // Orders
    ORDERS: `${API_BASE_URL}/orders`,
    ORDER_BY_ID: (id) => `${API_BASE_URL}/orders/${id}`,
    USER_ORDERS: `${API_BASE_URL}/user/orders`,
    
    // Admin Orders
    ADMIN_ORDERS: `${API_BASE_URL}/admin/orders`,
    ADMIN_ORDER_BY_ID: (id) => `${API_BASE_URL}/admin/orders/${id}`,
    CONFIRM_ORDER: (id) => `${API_BASE_URL}/admin/orders/${id}/confirm`,
    SHIP_ORDER: (id) => `${API_BASE_URL}/admin/orders/${id}/ship`,
    DELIVER_ORDER: (id) => `${API_BASE_URL}/admin/orders/${id}/deliver`,
    CANCEL_ORDER: (id) => `${API_BASE_URL}/admin/orders/${id}/cancel`,
    
    // Inquiries
    INQUIRIES: `${API_BASE_URL}/inquiries`,
    GENERAL_INQUIRY: `${API_BASE_URL}/inquiries/general`,
    TRADE_INQUIRY: `${API_BASE_URL}/inquiries/trade`,
    BULK_INQUIRY: `${API_BASE_URL}/inquiries/bulk`,
    
    // Payments
    CONFIRM_PAYMENT: `${API_BASE_URL}/payments/confirm`,
    
    // Uploads
    UPLOAD_IMAGE: `${API_BASE_URL}/upload`,
};

export default API_BASE_URL;
