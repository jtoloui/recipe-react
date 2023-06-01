import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Menu } from './components/Menu';

export const App = () => {
  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} index />

        <Route path="/hello" element={<ProtectedRoute />}>
          <Route path="/hello" element={<div>hello</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
