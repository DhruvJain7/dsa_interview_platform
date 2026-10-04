import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import CodeEditor from "../components/CodeEditor";

const API_BASE_URL = "http://127.0.0.1:8000";

function Practice() {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");

  const [sessionId, setSessionId] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [transcribing, setTranscribing] = useState(false);

  const [submissionResult, setSubmissionResult] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [submitError, setSubmitError] = useState("");

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript, setTranscript] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const response = await fetch(
          `${API_BASE_URL}/problems/${problemId}`
        );

        if (response.status === 404) {
          setNotFound(true);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch problem");
        }

        const data = await response.json();
        setProblem(data);
      } catch (error) {
        console.error(error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  const getToken = () => {
    return localStorage.getItem("articula_access_token");
  };

  const createSession = async () => {
    const token = getToken();

    if (!token) {
      setSubmitError(
        "Please log in before starting a practice session."
      );
      return null;
    }

    setSessionLoading(true);
    setSubmitError("");

    try {
      const response = await fetch(`${API_BASE_URL}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          problem_id: problemId,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to create session"
        );
      }

      setSessionId(data.session_id);

      return data.session_id;
    } catch (error) {
      console.error(error);
      setSubmitError(error.message);
      return null;
    } finally {
      setSessionLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      setSubmitError("Please write some code before submitting.");
      return;
    }

    const token = getToken();

    if (!token) {
      setSubmitError(
        "Please log in before submitting your solution."
      );
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    setSubmissionResult(null);
    setEvaluation(null);

    try {
      let activeSessionId = sessionId;

      if (!activeSessionId) {
        activeSessionId = await createSession();
      }

      if (!activeSessionId) {
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/sessions/${activeSessionId}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            code,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to submit solution"
        );
      }

      setSubmissionResult(data);
    } catch (error) {
      console.error(error);
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async () => {
    const token = getToken();

    if (!token) {
      setSubmitError(
        "Please log in before evaluating your articulation."
      );
      return;
    }

    if (!sessionId) {
      setSubmitError("No active session found.");
      return;
    }

    setCompleting(true);
    setSubmitError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/sessions/${sessionId}/complete`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to evaluate articulation"
        );
      }

      setSubmissionResult((current) => ({
        ...current,
        ...data,
        execution_result:
          data.execution_result || current?.execution_result,
      }));

      setEvaluation(data.evaluation || null);
    } catch (error) {
      console.error(error);
      setSubmitError(error.message);
    } finally {
      setCompleting(false);
    }
  };

  const handleStartRecording = async () => {
    setSubmitError("");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Audio recording is not supported by this browser."
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const recorder = new MediaRecorder(stream);

      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = recorder;

      recorder.start();
      setIsRecording(true);
      setAudioBlob(null);
      setTranscript("");
    } catch (error) {
      console.error(error);
      setSubmitError(
        error.message || "Unable to access the microphone."
      );
    }
  };

  const handleStopRecording = () => {
    const recorder = mediaRecorderRef.current;

    if (!recorder || recorder.state === "inactive") {
      return;
    }

    recorder.stop();
    setIsRecording(false);
  };

  const handleTranscribe = async () => {
    if (!audioBlob) {
      setSubmitError("Please record your articulation first.");
      return;
    }

    const token = getToken();

    if (!token) {
      setSubmitError(
        "Please log in before transcribing your articulation."
      );
      return;
    }

    setTranscribing(true);
    setSubmitError("");

    try {
      let activeSessionId = sessionId;

      if (!activeSessionId) {
        activeSessionId = await createSession();
      }

      if (!activeSessionId) {
        return;
      }

      const formData = new FormData();

      formData.append(
        "audio",
        audioBlob,
        "articulation.webm"
      );

      const response = await fetch(
        `${API_BASE_URL}/sessions/${activeSessionId}/transcript`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to transcribe audio"
        );
      }

      setTranscript(data.transcript || "");
    } catch (error) {
      console.error(error);
      setSubmitError(error.message);
    } finally {
      setTranscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#222222]">
        <Navbar />

        <main className="mx-auto max-w-[1000px] px-8 pb-20 pt-24">
          <p className="text-sm text-black/50 dark:text-white/50">
            Loading problem...
          </p>
        </main>
      </div>
    );
  }

  if (notFound || !problem) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#222222]">
        <Navbar />

        <main className="mx-auto max-w-[1000px] px-8 pb-20 pt-24">
          <p className="text-sm text-black/50 dark:text-white/50">
            Problem not found.
          </p>

          <button
            onClick={() => navigate("/problems")}
            className="mt-6 text-sm font-medium text-black transition-opacity hover:opacity-50 dark:text-white"
          >
            ← Back to Problems
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#222222]">
      <Navbar />

      <main className="mx-auto max-w-[1000px] px-8 pb-20 pt-24">
        {/* Back to problem */}
        <button
          onClick={() => navigate(`/problems/${problemId}`)}
          className="mb-10 text-sm text-black/50 transition-colors hover:text-black dark:text-white/50 dark:hover:text-white"
        >
          ← Back to Problem
        </button>

        {/* Problem header */}
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
            {problem.topic}
          </p>

          <div className="mt-4 flex items-start justify-between gap-6">
            <h1 className="font-display text-5xl tracking-tight text-black dark:text-[#F5F5F5] md:text-6xl">
              {problem.title}
            </h1>

            <span className="mt-2 text-sm uppercase tracking-wider text-black/50 dark:text-white/45">
              {problem.difficulty}
            </span>
          </div>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-black/65 dark:text-white/65">
            {problem.description}
          </p>
        </div>

        {/* Code editor */}
        <section className="mt-16">
          <CodeEditor
            problemId={problem.id}
            language={language}
            onLanguageChange={setLanguage}
            value={code}
            onChange={setCode}
          />
        </section>

        {/* Articulate */}
        <div className="mt-16 border-t border-black/10 pt-10 dark:border-white/10">
          <p className="text-sm uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
            Articulate
          </p>

          <h2 className="mt-4 font-display text-4xl text-black dark:text-[#F5F5F5]">
            Articulate your solution.
          </h2>

          <p className="mt-4 max-w-2xl text-black/55 dark:text-white/50">
            Explain your approach, edge cases, and complexity out loud.
            Articula will transcribe your explanation and evaluate how
            clearly you reason through the problem.
          </p>

          {/* Recording controls */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {!isRecording ? (
              <button
                onClick={handleStartRecording}
                className="border border-black bg-black px-6 py-3 text-sm text-white transition-opacity hover:opacity-80 dark:border-white dark:bg-white dark:text-black"
              >
                Start Recording
              </button>
            ) : (
              <button
                onClick={handleStopRecording}
                className="border border-black px-6 py-3 text-sm text-black transition-opacity hover:opacity-60 dark:border-white dark:text-white"
              >
                Stop Recording
              </button>
            )}

            {isRecording && (
              <div className="flex items-center gap-2 text-sm text-black/60 dark:text-white/60">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                Recording...
              </div>
            )}

            {!isRecording && audioBlob && (
              <>
                <p className="text-sm text-black/50 dark:text-white/50">
                  Recording captured.
                </p>

                <button
                  onClick={handleTranscribe}
                  disabled={transcribing}
                  className="border border-black px-6 py-3 text-sm text-black transition-opacity hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white dark:text-white"
                >
                  {transcribing
                    ? "Transcribing..."
                    : "Upload & Transcribe →"}
                </button>
              </>
            )}
          </div>

          {/* Transcript */}
          {transcript && (
            <div className="mt-8 border border-black/10 bg-[#fafaf8] p-6 dark:border-white/10 dark:bg-white/[0.025]">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
                Transcript
              </p>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-black/75 dark:text-white/75">
                {transcript}
              </p>
            </div>
          )}
        </div>

        {/* Error */}
        {submitError && (
          <div className="mt-8 border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-600 dark:text-red-400">
            {submitError}
          </div>
        )}

        {/* Submission result */}
        {submissionResult && (
          <div className="mt-8 border border-black/10 p-6 dark:border-white/10">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
                Submission
              </p>

              <span className="text-xs font-medium uppercase tracking-[0.15em] text-black dark:text-white">
                {submissionResult.status}
              </span>
            </div>

            <div className="mt-6">
              {submissionResult.execution_result?.success ? (
                <p className="text-sm text-black dark:text-white">
                  All test cases passed.
                </p>
              ) : (
                <p className="text-sm text-black dark:text-white">
                  The solution did not pass all test cases.
                </p>
              )}
            </div>

            {submissionResult.execution_result?.error && (
              <pre className="mt-4 overflow-x-auto whitespace-pre-wrap bg-black/[0.03] p-4 text-xs leading-6 text-black/70 dark:bg-white/[0.04] dark:text-white/70">
                {submissionResult.execution_result.error}
              </pre>
            )}
          </div>
        )}

        {/* Articulation Evaluation */}
        {evaluation && (
          <section className="mt-12 border-t border-black/10 pt-10 dark:border-white/10">
            <p className="text-sm uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
              Articulation Evaluation
            </p>

            <h2 className="mt-4 font-display text-4xl text-black dark:text-[#F5F5F5]">
              How you reasoned through the solution.
            </h2>

            {/* Evaluation dimensions */}
            <div className="mt-8 grid gap-px border border-black/10 bg-black/10 dark:border-white/10 dark:bg-white/10 md:grid-cols-2">
              {[
                {
                  label: "Problem Understanding",
                  data: evaluation.problem_understanding,
                },
                {
                  label: "Approach / Logic",
                  data: evaluation.approach,
                },
                {
                  label: "Complexity",
                  data: evaluation.complexity,
                },
                {
                  label: "Clarity & Articulation",
                  data: evaluation.clarity_and_articulation,
                },
                {
                  label: "Optimization",
                  data: evaluation.optimization,
                },
              ].map((dimension) => (
                <div
                  key={dimension.label}
                  className="bg-white p-6 dark:bg-[#222222]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm font-medium text-black dark:text-white">
                      {dimension.label}
                    </p>

                    {dimension.data?.score != null ? (
                      <span className="text-sm font-medium text-black dark:text-white">
                        {dimension.data.score}/5
                      </span>
                    ) : (
                      <span className="text-xs text-black/40 dark:text-white/40">
                        Not evaluated
                      </span>
                    )}
                  </div>

                  {dimension.data?.feedback && (
                    <p className="mt-4 text-sm leading-7 text-black/60 dark:text-white/60">
                      {dimension.data.feedback}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Overall feedback */}
            {evaluation.overall_feedback && (
              <div className="mt-8 border border-black/10 p-6 dark:border-white/10">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
                  Overall
                </p>

                <p className="mt-4 text-sm leading-7 text-black/70 dark:text-white/70">
                  {evaluation.overall_feedback}
                </p>
              </div>
            )}

            {/* Strengths */}
            {evaluation.strengths?.length > 0 && (
              <div className="mt-8">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
                  Strengths
                </p>

                <ul className="mt-4 space-y-3">
                  {evaluation.strengths.map((strength, index) => (
                    <li
                      key={index}
                      className="flex gap-3 text-sm leading-7 text-black/70 dark:text-white/70"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black/40 dark:bg-white/40" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {evaluation.improvements?.length > 0 && (
              <div className="mt-8">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
                  Areas to Improve
                </p>

                <ul className="mt-4 space-y-3">
                  {evaluation.improvements.map((improvement, index) => (
                    <li
                      key={index}
                      className="flex gap-3 text-sm leading-7 text-black/70 dark:text-white/70"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black/40 dark:bg-white/40" />
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Submit / Evaluate */}
        <div className="mt-12 flex justify-end gap-4 border-t border-black/10 pt-8 dark:border-white/10">
          <button
            onClick={handleSubmit}
            disabled={
              submitting ||
              sessionLoading ||
              completing ||
              transcribing ||
              submissionResult?.status === "completed"
            }
            className="border border-black bg-black px-6 py-3 text-sm text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white dark:bg-white dark:text-black"
          >
            {submitting || sessionLoading
              ? "Running..."
              : "Submit Practice →"}
          </button>

          {submissionResult?.status === "submitted" && (
            <button
              onClick={handleComplete}
              disabled={completing || transcribing}
              className="border border-black px-6 py-3 text-sm text-black transition-opacity hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white dark:text-white"
            >
              {completing
                ? "Evaluating..."
                : "Evaluate Articulation →"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

export default Practice;
