import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import Practice from "./pages/Practice";
import Auth from "./pages/Auth";
import SessionDetail from "./pages/SessionDetail";
import Interactive from "./pages/Interactive";
import AdaptiveSessionDetail from "./pages/AdaptiveSessionDetail";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/problems" element={<Problems />} />

      <Route
        path="/problems/:problemId"
        element={<ProblemDetail />}
      />

      <Route
        path="/problems/:problemId/practice"
        element={<Practice />}
      />

      <Route
        path="/interactive"
        element={<Interactive />}
      />

      {/* Adaptive Practice Journey */}
      <Route
        path="/interactive/session/:adaptiveSessionId"
        element={<AdaptiveSessionDetail />}
      />

      {/* Individual Problem Session */}
      <Route
        path="/sessions/:sessionId"
        element={<SessionDetail />}
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
      
    </Routes>
  );
}

export default App;