import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";

function Navbar({ activePage, onNavigate }) {
  const navItems = [
    { label: "Dashboard", page: "dashboard" },
    { label: "Practice", page: "problems" },
    { label: "Interactive", page: "interactive" },
  ];

  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  // Dynamic Island transition
  const horizontalPadding = useTransform(
    scrollY,
    [0, 120],
    [0, 20]
  );

  const verticalPadding = useTransform(
    scrollY,
    [0, 120],
    [0, 9]
  );

  const scale = useTransform(
    scrollY,
    [0, 120],
    [1, 0.96]
  );

  const maxWidth = useTransform(
    scrollY,
    [0, 120],
    ["1350px", "720px"]
  );

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <header className="sticky top-4 z-50 -mb-[72px] px-6 md:px-10">
      <motion.nav
        style={{
          paddingTop: verticalPadding,
          paddingBottom: verticalPadding,
          paddingLeft: horizontalPadding,
          paddingRight: horizontalPadding,
          scale,
          maxWidth,
        }}
        animate={{
          borderRadius: scrolled ? 999 : 0,
          backgroundColor: scrolled
            ? darkMode
              ? "rgba(34, 34, 34, 0.82)"
              : "rgba(255, 255, 255, 0.82)"
            : "rgba(255, 255, 255, 0)",
          borderColor: scrolled
            ? darkMode
              ? "rgba(255, 255, 255, 0.10)"
              : "rgba(0, 0, 0, 0.10)"
            : "rgba(0, 0, 0, 0)",
          boxShadow: scrolled
            ? "0 8px 30px rgba(0, 0, 0, 0.08)"
            : "0 0 0 rgba(0, 0, 0, 0)",
        }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative mx-auto flex items-center justify-between border backdrop-blur-xl"
      >
        {/* Logo */}
        <button
          onClick={() => onNavigate("home")}
          className="text-[28px] tracking-tight text-black dark:text-[#F5F5F5]"
        >
          Articula
        </button>

        {/* Center Navigation */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center rounded-full border border-black/50 bg-[#fffafa] px-2 py-1.5 md:flex dark:border-white/20 dark:bg-[#222222]">
          {navItems.map((item) => {
            const isActive = activePage === item.page;

            return (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`rounded-full px-7 py-2 text-[15px] transition-colors ${
                  isActive
                    ? "bg-black text-white dark:bg-[#F5F5F5] dark:text-[#181818]"
                    : "text-black hover:bg-black hover:text-white dark:text-[#F5F5F5] dark:hover:bg-[#292929]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            aria-label={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            className="text-black transition-opacity hover:opacity-50 dark:text-[#F5F5F5]"
          >
            {darkMode ? "☀" : "☾"}
          </button>

          {/* GitHub */}
          <button
            aria-label="GitHub"
            className="text-black transition-opacity hover:opacity-50 dark:text-[#F5F5F5]"
          >
            <svg
              width="23"
              height="23"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 22v-4c.1-1.1-.4-2.1-1.4-2.5 3.4-.4 7-1.7 7-7.5a5.8 5.8 0 0 0-1.6-4.1A5.4 5.4 0 0 0 18.9.3S17.6-.1 15 1.6a13.4 13.4 0 0 0-6 0C6.4-.1 5.1.3 5.1.3a5.4 5.4 0 0 0-.1 3.6c-1 1.1-1.6 2.5-1.6 4.1 0 5.8 3.6 7.1 7 7.5-1 .4-1.5 1.4-1.4 2.5v4" />
              <path d="M9 18c-3.3 1.5-3.3-1.5-4.6-1.5" />
            </svg>
          </button>

          {/* Code */}
          <button
            aria-label="Code"
            className="text-black transition-opacity hover:opacity-50 dark:text-[#F5F5F5]"
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="8 9 4 12 8 15" />
              <polyline points="16 9 20 12 16 15" />
            </svg>
          </button>

        </div>
      </motion.nav>
    </header>
  );
}

export default Navbar;