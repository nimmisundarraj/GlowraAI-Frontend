import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Callback = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      login(token);
      navigate("/");
    } else {
      console.error("No token found in query params.");
      navigate("/login");
    }
  }, [location.search, login, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-600 text-lg">Logging you in...</p>
    </div>
  );
};

export default Callback;
