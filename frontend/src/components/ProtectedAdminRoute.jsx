import { Navigate, useLocation } from "react-router-dom";
import { isAdminAuthenticated } from "../utils/adminAuth";

const ProtectedAdminRoute = ({ children }) => {
  const location = useLocation();

  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedAdminRoute;
