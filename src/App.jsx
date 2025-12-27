import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ContactUs from './pages/ContactUs';
import Shop from './pages/Shop';
import ProductPage from './pages/ProductPage';
import Admin from './pages/Admin';
import OrderDetails from './pages/admin/OrderDetails';
import UserOrders from './pages/UserOrders';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import OrderConfirmation from './pages/OrderConfirmation';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { Button } from './components/ui/button';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <CartProvider>
        <Toaster />
        <div className="flex flex-col min-h-screen">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute><ContactUs /></ProtectedRoute>} />
            <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
            <Route path="/product" element={<ProtectedRoute><ProductPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="/admin/orders/:orderId" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
            <Route path="/my-orders" element={<ProtectedRoute><UserOrders /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
            <Route path="/order-confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
          </Routes>
          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
