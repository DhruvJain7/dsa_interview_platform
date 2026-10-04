import {
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getToken } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("articula-theme");

    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDark;

    setIsDark(nextTheme);

    if (nextTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("articula-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("articula-theme", "light");
    }
  };

  const isAuthenticated = Boolean(getToken());

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Practice", path: "/problems" },
    { label: "Interactive", path: null },
  ];

  const navbarClasses = isScrolled
    ? "fixed left-1/2 top-5 z-50 flex w-[calc(100%-2rem)] max-w-[1100px] -translate-x-1/2 items-center justify-between rounded-full border border-black/10 bg-white/90 px-5 py-3 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-[#222222]/90 md:px-6"
    : "fixed left-0 top-0 z-50 flex w-full items-center justify-between px-6 py-6 md:px-10";

  return (
    <motion.nav
      animate={{
        scale: isScrolled ? 1 : 1,
      }}
      transition={{
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={navbarClasses}
    >
      {/* Logo */}
      <button
        onClick={() => navigate("/")}
        className="shrink-0 font-display text-xl tracking-[-0.02em] text-black dark:text-[#F5F5F5]"
      >
        Articula
      </button>

      {/* Navigation */}
      <div className="hidden items-center gap-8 md:flex">
        {navItems.map((item) => {
          const isActive =
            item.path &&
            (
              location.pathname === item.path ||
              (item.path === "/problems" &&
                location.pathname.startsWith("/problems/")) ||
              (item.path === "/dashboard" &&
                location.pathname.startsWith("/sessions/"))
            );

          return (
            <button
              key={item.label}
              onClick={() => {
                if (item.path) {
                  navigate(item.path);
                }
              }}
              disabled={!item.path}
              className={`relative text-xs font-medium transition-colors ${
                isActive
                  ? "text-black dark:text-white"
                  : item.path
                    ? "text-black/45 hover:text-black dark:text-white/45 dark:hover:text-white"
                    : "cursor-default text-black/25 dark:text-white/25"
              }`}
            >
              {item.label}

              {isActive && (
                <motion.span
                  layoutId="navbar-active"
                  className="absolute -bottom-1 left-0 right-0 h-px bg-black dark:bg-white"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/auth")}
          className="text-xs font-medium text-black/60 transition-colors hover:text-black dark:text-white/60 dark:hover:text-white"
        >
          {isAuthenticated ? "Account" : "Sign in"}
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex h-8 w-8 items-center justify-center rounded-full text-black/50 transition-colors hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
        >
          {isDark ? (
            <span className="text-sm">☀</span>
          ) : (
            <span className="text-sm">☾</span>
          )}
        </button>

        {/* GitHub / Code */}
        <button
          onClick={() =>
            window.open(
              "https://github.com/DhruvJain7/dsa_interview_platform",
              "_blank",
              "noopener,noreferrer",
            )
          }
          aria-label="GitHub"
          className="flex h-8 w-8 items-center justify-center rounded-full text-black/50 transition-colors hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 fill-current"
            aria-hidden="true"
          >
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.95 10.95 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.13 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
          </svg>
        </button>
      </div>
    </motion.nav>
  );
}

export default Navbar;
