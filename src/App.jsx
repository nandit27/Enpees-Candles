import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ContactUs from './pages/ContactUs';
import Admin from './pages/Admin';
import Footer from './components/Footer';
import { Button } from './components/ui/button';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 gap-4">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Enpees Candles</h1>
              <div className="flex gap-4">
                <Link to="/contact">
                  <Button>Contact Us</Button>
                </Link>
                <Link to="/admin">
                  <Button variant="outline">Admin Panel</Button>
                </Link>
              </div>
            </div>
          } />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
