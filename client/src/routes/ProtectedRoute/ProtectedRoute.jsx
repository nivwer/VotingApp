import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ isAllowed, children, redirectTo = "/signin" }) {
  if (!isAllowed) return <Navigate to={redirectTo} />;
  return children ? children : <Outlet />;
}

export default ProtectedRoute;
