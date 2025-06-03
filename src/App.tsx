import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import Login from "./pages/Login";
import Callback from "./pages/Callback";
import { Dashboard } from "./pages/Dashboard";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
