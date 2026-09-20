import { useState } from "react";
import Home from "./pages/Home";
import Problems from "./pages/Problems";

function App() {
  const [page, setPage] = useState("home");
  const [selectedProblem, setSelectedProblem] = useState(null);

  if (page === "problems") {
    return (
      <Problems
        onNavigate={setPage}
        onSelectProblem={(problem) => {
          setSelectedProblem(problem);
          console.log("Selected problem:", problem);
        }}
      />
    );
  }

  return (
    <Home onNavigate={setPage} />
  );
}

export default App;
