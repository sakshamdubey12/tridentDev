import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductDetail from './components/ProductDetail';
import Header from './components/Header';
import Home from './components/Home';
import Cart from './components/Cart';
import Account from './components/Account';
import Profile from './components/Profile';
import PreviousOrders from './components/PreviousOrders';
import AdminDashboard from './components/admin/AdminDashboard';
import OrderDetails from './components/orderDetails';
import AboutUs from './components/AboutUs';
import Policy from './components/Policy';
import Contact from './components/Contact';
function App() {
  return (
    <div>
      <Header />
      {/* <Router> */}
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/account" element={<Account />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/previous-orders" element={<PreviousOrders />} />
        <Route path="/order/:orderId" element={<OrderDetails />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    {/* </Router> */}
    </div>
    
  
  );
}

export default App;
