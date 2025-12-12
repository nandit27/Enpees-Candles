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
            <Route path="/" element={<LandingPage />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/orders/:orderId" element={<OrderDetails />} />
            <Route path="/my-orders" element={<UserOrders />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
          </Routes>
          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
