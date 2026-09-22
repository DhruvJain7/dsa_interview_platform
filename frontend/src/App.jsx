import { useState } from "react";
import Home from "./pages/Home";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import Practice from "./pages/Practice";

function App() {
  const [page, setPage] = useState("home");
  const [selectedProblem, setSelectedProblem] = useState(null);

  if (page === "problems") {
    return (
      <Problems
        onNavigate={setPage}
        onSelectProblem={(problem) => {
          setSelectedProblem(problem);
          setPage("problem-detail");
        }}
      />
    );
  }

  if (page === "problem-detail" && selectedProblem) {
    return (
      <ProblemDetail
        problem={selectedProblem}
        onNavigate={setPage}
      />
    );
  }
  if (page === "practice" && selectedProblem) {
    return (
      <Practice
        problem={selectedProblem}
        onNavigate={setPage}
      />
    );
  }
  return (
    <Home onNavigate={setPage} />
  );
}

export default App;
