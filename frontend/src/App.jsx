import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import Practice from "./pages/Practice";
import Auth from "./pages/Auth";

function App() {
  return (
    <Routes>
      {/* Landing page */}
      <Route path="/" element={<Home />} />

      {/* Authentication */}
      <Route path="/auth" element={<Auth />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Problems */}
      <Route path="/problems" element={<Problems />} />

      <Route
        path="/problems/:problemId"
        element={<ProblemDetail />}
      />

      <Route
        path="/problems/:problemId/practice"
        element={<Practice />}
      />

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;
