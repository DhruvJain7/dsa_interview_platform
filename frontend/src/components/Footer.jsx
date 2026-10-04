import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Footer({ variant = "full" }) {
  const navigate = useNavigate();

  const methodItems = [
    "Think",
    "Articulate",
    "Code",
    "Improve",
  ];

  // =========================================================
  // MINIMAL FOOTER
  // =========================================================
  if (variant === "minimal") {
    return (
      <footer className="border-t border-black/10 dark:border-white/10">
        <div className="mx-auto max-w-[1350px] px-6 md:px-16">
          <div className="flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">

            {/* Brand */}
            <button
              onClick={() => navigate("/")}
              className="w-fit text-[28px] tracking-tight text-black dark:text-[#F5F5F5]"
            >
              Articula
            </button>

            {/* Navigation */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-black/60 dark:text-white/60">
              <button
                onClick={() => navigate("/problems")}
                className="transition-opacity hover:opacity-50"
              >
                Practice
              </button>

              <button
                onClick={() => navigate("/")}
                className="transition-opacity hover:opacity-50"
              >
                Dashboard
              </button>

              <button
                type="button"
                disabled
                className="cursor-default text-black/30 dark:text-white/30"
              >
                Interactive
              </button>
            </div>

            {/* GitHub */}
            <button
              aria-label="GitHub"
              className="w-fit text-black transition-opacity hover:opacity-50 dark:text-[#F5F5F5]"
            >
              <svg
                width="22"
                height="22"
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
          </div>

          {/* Copyright */}
          <div className="border-t border-black/10 py-5 dark:border-white/10">
            <p className="text-xs text-black/40 dark:text-white/40">
              © 2026 Articula
            </p>
          </div>
        </div>
      </footer>
    );
  }

  // =========================================================
  // FULL FOOTER
  // =========================================================
  return (
    <footer className="border-t border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-[1350px] px-6 md:px-16">

        {/* Final CTA */}
        <section className="py-24 text-center md:py-32">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-black/40 dark:text-white/40"
          >
            Ready to practice?
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="font-display text-5xl leading-[1] tracking-[-0.04em] text-black dark:text-[#F5F5F5] md:text-7xl"
          >
            Articulate better.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mx-auto mt-6 max-w-[500px] text-sm leading-6 text-black/50 dark:text-white/50 md:text-base"
          >
            Practice the way you interview.
            Think clearly, explain your reasoning,
            and improve with every problem.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/problems")}
            className="group mt-9 rounded-full bg-black px-7 py-3.5 text-sm font-medium text-white dark:bg-[#F5F5F5] dark:text-[#181818]"
          >
            Start Practicing

            <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </motion.button>
        </section>

        {/* Articula Method */}
        <section className="border-y border-black/10 py-8 dark:border-white/10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/40 dark:text-white/40">
              The Articula Method
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 md:gap-x-8">
              {methodItems.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.08,
                  }}
                  className="flex items-center gap-5"
                >
                  <motion.span
                    whileHover={{ y: -2 }}
                    className="cursor-default text-sm font-medium text-black/70 transition-colors hover:text-black dark:text-white/70 dark:hover:text-white"
                  >
                    {item}
                  </motion.span>

                  {index < methodItems.length - 1 && (
                    <span className="text-black/20 dark:text-white/20">
                      →
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer Navigation */}
        <div className="flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">

          {/* Brand */}
          <button
            onClick={() => navigate("/")}
            className="w-fit text-[28px] tracking-tight text-black dark:text-[#F5F5F5]"
          >
            Articula
          </button>

          {/* Navigation */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-black/60 dark:text-white/60">
            <button
              onClick={() => navigate("/problems")}
              className="transition-opacity hover:opacity-50"
            >
              Practice
            </button>

            <button
              onClick={() => navigate("/")}
              className="transition-opacity hover:opacity-50"
            >
              Dashboard
            </button>

            <button
              type="button"
              disabled
              className="cursor-default text-black/30 dark:text-white/30"
            >
              Interactive
            </button>
          </div>

          {/* GitHub */}
          <button
            aria-label="GitHub"
            className="w-fit text-black transition-opacity hover:opacity-50 dark:text-[#F5F5F5]"
          >
            <svg
              width="22"
              height="22"
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
        </div>

        {/* Copyright */}
        <div className="border-t border-black/10 py-5 dark:border-white/10">
          <p className="text-xs text-black/40 dark:text-white/40">
            © 2026 Articula
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
