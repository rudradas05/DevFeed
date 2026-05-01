import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="page-status">
        <span className="spinner spinner-dark" aria-hidden="true" />
        <p>Loading your feed...</p>
      </main>
    );
  }

  if (!user) return <Navigate to="/login" />;

  return children;
}
