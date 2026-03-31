import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout & Context


// Public Pages
import Welcome from './pages/Welcome'; 
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home'; 
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';


// Customer Pages
import CustomerDashboard from './pages/CustomerDashboard';
import Cart from './pages/Cart';
import OrderTracking from './pages/OrderTracking';
import Checkout from './pages/Checkout';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminProductList from './pages/AdminProductList';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import AdminCustomerList from './pages/AdminCustomerList';
import AddCustomer from './pages/AddCustomer';
import EditCustomer from './pages/EditCustomer';
import AdminOrderManagement from './pages/AdminOrderManagement';
import AdminProfile from './pages/AdminProfile';
import AdminBugs from './pages/AdminBugs';


function App() {
  return (
    <Router>
      <Routes>
        {/* Onboarding Flow */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Customer Flow */}
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/profile" element={<CustomerDashboard />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-tracking/:id" element={<OrderTracking />} />

        
        {/* Admin Flow */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/profile" element={<AdminProfile />} />

        <Route path="/admin/products" element={<AdminProductList />} />
        <Route path="/admin/products/add" element={<AddProduct />} />
        <Route path="/admin/products/edit/:id" element={<EditProduct />} />

        <Route path="/admin/customers" element={<AdminCustomerList />} />
        <Route path="/admin/customers/edit/:id" element={<EditCustomer />} />        
        <Route path="/admin/customers/add" element={<AddCustomer />} />

        <Route path="/admin/orders" element={<AdminOrderManagement />} />
        <Route path="/admin/bugs" element={<AdminBugs />} />
      </Routes>
    </Router>
  );
}

export default App;