import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Login } from '@/pages/Login';
import { Home } from '@/pages/Home';
import { Menu } from '@/components/Menu';
import { Profile } from '@/pages/Profile';

export const App = () => {
  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path="/login" element={<Login />} index />
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route path="/profile" element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
};
