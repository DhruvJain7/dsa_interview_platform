import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  getCurrentUser,
  login,
  logout,
} from "../utils/auth";

const API_BASE_URL = "http://127.0.0.1:8000";

function AuthOrbits() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* =====================================================
          LEFT OUTER ORBIT
      ====================================================== */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 34,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-[-360px] top-[150px] h-[430px] w-[800px]"
      >
        {/* Orbit */}
        <div className="absolute inset-0 rounded-[50%] border border-black/[0.075] dark:border-white/[0.075]" />

        {/* Black node — exactly on left edge */}
        <div className="absolute left-0 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/30 dark:bg-white/30" />

        {/* Blue node — exactly on right edge */}
        <div className="absolute right-0 top-1/2 h-1.5 w-1.5 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5B7CFA]/65 dark:bg-[#6D8BFF]/65" />
      </motion.div>

      {/* =====================================================
          LEFT INNER ORBIT
      ====================================================== */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-[-280px] top-[215px] h-[300px] w-[620px]"
      >
        {/* Orbit */}
        <div className="absolute inset-0 rounded-[50%] border border-black/[0.05] dark:border-white/[0.05]" />

        {/* Node — exactly on right edge */}
        <div className="absolute right-0 top-1/2 h-1.5 w-1.5 translate-x-1/2 -translate-y-1/2 rounded-full bg-black/25 dark:bg-white/25" />
      </motion.div>

      {/* =====================================================
          RIGHT OUTER ORBIT
      ====================================================== */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute right-[-360px] top-[150px] h-[430px] w-[800px]"
      >
        {/* Orbit */}
        <div className="absolute inset-0 rounded-[50%] border border-black/[0.075] dark:border-white/[0.075]" />

        {/* Black node — exactly on right edge */}
        <div className="absolute right-0 top-1/2 h-2 w-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-black/30 dark:bg-white/30" />

        {/* Blue node — exactly on left edge */}
        <div className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5B7CFA]/65 dark:bg-[#6D8BFF]/65" />
      </motion.div>

      {/* =====================================================
          RIGHT INNER ORBIT
      ====================================================== */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute right-[-280px] top-[215px] h-[300px] w-[620px]"
      >
        {/* Orbit */}
        <div className="absolute inset-0 rounded-[50%] border border-black/[0.05] dark:border-white/[0.05]" />

        {/* Node — exactly on left edge */}
        <div className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/25 dark:bg-white/25" />
      </motion.div>
    </div>
  );
}

function Auth() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setSuccess("");

    setName("");
    setEmail("");
    setPassword("");
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await login(email, password);

      const currentUser = await getCurrentUser();
      setUser(currentUser);

      setEmail("");
      setPassword("");
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Signup failed");
      }

      setSuccess("Account created. You can now sign in.");

      setName("");
      setEmail("");
      setPassword("");

      setMode("login");
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#222222]">
        <Navbar />

        <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 pb-24 pt-28">
          <p className="text-sm text-black/40 dark:text-white/40">
            Loading...
          </p>
        </main>

        <Footer variant="minimal" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#222222]">
        <Navbar />

        <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-6 pb-24 pt-28">
          <AuthOrbits />

          <div className="relative z-10 w-full max-w-md">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40 dark:text-white/35">
              Account
            </p>

            <h1 className="mt-4 font-display text-4xl tracking-[-0.03em] text-black dark:text-[#F5F5F5]">
              You're signed in.
            </h1>

            <div className="mt-8 border-y border-black/10 py-6 dark:border-white/10">
              <p className="text-sm text-black/50 dark:text-white/45">
                {user.name}
              </p>

              <p className="mt-2 text-sm text-black/40 dark:text-white/35">
                {user.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="mt-8 w-full bg-black px-6 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-black"
            >
              Log out
            </button>

            <button
              onClick={() => navigate("/")}
              className="mt-4 w-full py-3 text-sm text-black/50 transition-colors hover:text-black dark:text-white/45 dark:hover:text-white"
            >
              Back to Articula
            </button>
          </div>
        </main>

        <Footer variant="minimal" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#222222]">
      <Navbar />

      <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-6 pb-24 pt-28">
        <AuthOrbits />

        <div className="relative z-10 w-full max-w-md">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40 dark:text-white/35">
            Account
          </p>

          <h1 className="mt-4 font-display text-4xl tracking-[-0.03em] text-black dark:text-[#F5F5F5]">
            {mode === "login"
              ? "Sign in to Articula."
              : "Create your Articula account."}
          </h1>

          <p className="mt-4 text-sm leading-7 text-black/50 dark:text-white/45">
            {mode === "login"
              ? "Continue your interview practice sessions."
              : "Start practicing DSA interviews with Articula."}
          </p>

          <form
            onSubmit={
              mode === "login"
                ? handleLogin
                : handleSignup
            }
            className="mt-10 space-y-6"
          >
            {mode === "signup" && (
              <div>
                <label
                  htmlFor="name"
                  className="text-xs font-medium uppercase tracking-[0.15em] text-black/50 dark:text-white/40"
                >
                  Name
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  className="mt-3 w-full border-b border-black/15 bg-transparent px-0 py-3 text-sm text-black outline-none transition-colors placeholder:text-black/25 focus:border-black dark:border-white/15 dark:text-white dark:placeholder:text-white/25 dark:focus:border-white"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="text-xs font-medium uppercase tracking-[0.15em] text-black/50 dark:text-white/40"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="mt-3 w-full border-b border-black/15 bg-transparent px-0 py-3 text-sm text-black outline-none transition-colors placeholder:text-black/25 focus:border-black dark:border-white/15 dark:text-white dark:placeholder:text-white/25 dark:focus:border-white"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-xs font-medium uppercase tracking-[0.15em] text-black/50 dark:text-white/40"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
                autoComplete={
                  mode === "login"
                    ? "current-password"
                    : "new-password"
                }
                placeholder="••••••••"
                className="mt-3 w-full border-b border-black/15 bg-transparent px-0 py-3 text-sm text-black outline-none transition-colors placeholder:text-black/25 focus:border-black dark:border-white/15 dark:text-white dark:placeholder:text-white/25 dark:focus:border-white"
              />
            </div>

            {error && (
              <div className="border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="border border-black/10 bg-black/[0.025] px-4 py-3 text-sm text-black/60 dark:border-white/10 dark:bg-white/[0.025] dark:text-white/60">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black px-6 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
            >
              {submitting
                ? mode === "login"
                  ? "Signing in..."
                  : "Creating account..."
                : mode === "login"
                  ? "Sign in →"
                  : "Create account →"}
            </button>
          </form>

          <div className="mt-8 text-center">
            {mode === "login" ? (
              <p className="text-sm text-black/45 dark:text-white/40">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="font-medium text-black underline underline-offset-4 transition-opacity hover:opacity-50 dark:text-white"
                >
                  Create one
                </button>
              </p>
            ) : (
              <p className="text-sm text-black/45 dark:text-white/40">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="font-medium text-black underline underline-offset-4 transition-opacity hover:opacity-50 dark:text-white"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer variant="minimal" />
    </div>
  );
}

export default Auth;
