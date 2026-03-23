import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { Dashboard, Masters, Rooms, Users, Contracts, Login, Register } from "./pages";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/layout.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="masters" element={<Masters />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="users" element={<Users />} />
          <Route path="contracts" element={<Contracts />} />
        </Route>
      </Routes>

    </BrowserRouter>
  );
}

export default App;