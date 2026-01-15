import { Route, Routes, Navigate } from "react-router";

import LandingPage from "./pages/LandingPage.jsx";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import JobDetailPage from "./pages/JobDetailPage";
import AIAssistant from "./pages/AIAssistant";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";

const App = () => {
  const { user, loading } = useAuth();

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#00FF9D40_100%)]" />
      <Routes>
        <Route
          path="/"
          element={loading ? null : user ? <Navigate to="/app" replace /> : <LandingPage />}
        />

        <Route
          path="/login"
          element={loading ? null : user ? <Navigate to="/app" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={loading ? null : user ? <Navigate to="/app" replace /> : <RegisterPage />}
        />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/create"
          element={
            <ProtectedRoute>
              <CreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/job/:id"
          element={
            <ProtectedRoute>
              <JobDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/ai"
          element={
            <ProtectedRoute>
              <AIAssistant />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
