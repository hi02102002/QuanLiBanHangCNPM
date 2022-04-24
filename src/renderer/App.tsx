import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import Admin from './components/Admin';
import RequireAuth from './components/RequireAuth';
import Category from './pages/Category';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Login from './pages/Login';
import Payment from './pages/Payment';
import Products from './pages/Products';
import SettingAccount from './pages/SettingAccount';
import Staff from './pages/Staff';
import Statistic from './pages/Statistic';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Admin>
                <Home />
              </Admin>
            </RequireAuth>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/products" element={<Products />} />
        <Route path="/category" element={<Category />} />
        <Route path="/setting-account" element={<SettingAccount />} />
        <Route path="/statistic" element={<Statistic />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </Router>
  );
}
