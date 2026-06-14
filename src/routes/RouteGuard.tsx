import { Navigate, Outlet } from "react-router-dom";

// 🔒 PROTECTED ROUTE: Strictly for normal users/customers
export const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || '{}');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 🛑 THE CRITICAL FIX: If the logged-in user is an admin, 
  // do NOT let them see the user dashboard. Redirect them to their own portal!
  if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

// 🔓 PUBLIC ROUTE: For guests only (Login / Register)
export const PublicRoute = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || '{}');

  if (token) {
    // Smart redirect: send them straight to their correct dashboard if they try to visit login
    return user.role === 'admin' 
      ? <Navigate to="/admin/dashboard" replace /> 
      : <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};

// 👑 ADMIN ROUTE: Strictly for administrators
export const AdminRoute = () => {
   const token = localStorage.getItem("token");
   const user = JSON.parse(localStorage.getItem("user") || '{}');
   
   if (!token) {
     return <Navigate to='/login' replace />;
   }
   
   // If they are an admin, give them access. If not, bounce them back to the user area.
   return user.role === 'admin' ? <Outlet /> : <Navigate to='/dashboard' replace />;
};