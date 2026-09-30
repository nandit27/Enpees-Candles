import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ContactUs from './pages/ContactUs';
import Shop from './pages/Shop';
import ProductPage from './pages/ProductPage';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import OrderDetails from './pages/admin/OrderDetails';
import TrackOrder from './pages/TrackOrder';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import OrderConfirmation from './pages/OrderConfirmation';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';

function Shell() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');
  return (
    <div className="flex flex-col min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:m-2 focus:rounded-full focus:bg-[#4A2A1A] focus:px-4 focus:py-2 focus:font-jost focus:text-sm focus:text-[#FAF6EF]"
      >
        Skip to content
      </a>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/admin/orders/:orderId" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <CartProvider>
        <Toaster />
        <Shell />
      </CartProvider>
    </Router>
  );
}

export default App;
