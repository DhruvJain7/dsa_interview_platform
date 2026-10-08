import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  const navigate = useNavigate();

  const scrollToMethod = () => {
    document.getElementById("articula-method")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const methodSteps = [
    {
      number: "01",
      title: "Think",
      text: "Understand the problem, identify the pattern, and build your approach.",
    },
    {
      number: "02",
      title: "Articulate",
      text: "Explain your reasoning, edge cases, and complexity before you code.",
    },
    {
      number: "03",
      title: "Code",
      text: "Turn your reasoning into a working solution and test it against real cases.",
    },
    {
      number: "04",
      title: "Improve",
      text: "Get feedback on your thinking and learn how to communicate better.",
    },
  ];

  const adaptiveSteps = [
    {
      number: "01",
      title: "Your performance",
      text: "Previous solutions, execution results, and articulation feedback.",
    },
    {
      number: "02",
      title: "Analyze",
      text: "Identify strengths, weaknesses, patterns, and areas that need practice.",
    },
    {
      number: "03",
      title: "Decide",
      text: "Choose the next useful challenge, follow-up, hint, or difficulty.",
    },
    {
      number: "04",
      title: "Keep improving",
      text: "Your next attempt becomes part of the profile for the following decision.",
    },
  ];

  const dashboardSkills = [
    ["Problem Understanding", "4.6", "92%"],
    ["Approach / Logic", "4.4", "88%"],
    ["Complexity", "4.8", "96%"],
    ["Clarity & Articulation", "3.9", "78%"],
    ["Optimization", "4.2", "84%"],
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F7F5] text-[#111111] dark:bg-[#222222] dark:text-white">
      <style>{`
        .articula-hero {
          padding-top: 7rem;
          padding-bottom: 5rem;
        }

        .articula-hero-headline {
          font-size: clamp(4rem, 8vw, 7rem);
        }

        .articula-hero-description {
          margin-top: 1.75rem;
        }

        .articula-hero-actions {
          margin-top: 2rem;
        }

        .articula-product {
          margin-top: 4rem;
        }

        .articula-flow {
          margin-top: 4rem;
        }

        /*
         * Laptop / constrained desktop
         *
         * Designed for common MDM laptop sizes such as:
         * 1280x720
         * 1366x768
         *
         * The important difference here is that we reduce the visual
         * footprint without relying on aggressive transform scaling.
         */
        @media (min-width: 768px) and (max-width: 1399px) {
          .articula-hero {
            padding-top: 5.75rem;
            padding-bottom: 3.5rem;
          }

          .articula-hero-headline {
            font-size: clamp(3.6rem, 6.8vw, 5.6rem);
          }

          .articula-hero-description {
            margin-top: 1.35rem;
          }

          .articula-hero-actions {
            margin-top: 1.5rem;
          }

          .articula-product {
            margin-top: 3rem;
            max-width: 820px;
          }

          .articula-flow {
            margin-top: 2.75rem;
            max-width: 820px;
          }

          .articula-left-outer {
            left: -300px !important;
            top: 150px !important;
            width: 570px !important;
            height: 300px !important;
          }

          .articula-left-inner {
            left: -220px !important;
            top: 205px !important;
            width: 420px !important;
            height: 220px !important;
          }

          .articula-right-outer {
            right: -300px !important;
            top: 150px !important;
            width: 570px !important;
            height: 300px !important;
          }

          .articula-right-inner {
            right: -220px !important;
            top: 205px !important;
            width: 420px !important;
            height: 220px !important;
          }
        }

        /*
         * Short laptop screens.
         *
         * Keep the hero compact vertically so the first viewport
         * doesn't feel crowded.
         */
        @media (min-width: 768px) and (max-height: 780px) {
          .articula-hero {
            padding-top: 5.25rem;
            padding-bottom: 3rem;
          }

          .articula-hero-headline {
            font-size: clamp(3.4rem, 6.3vw, 5.2rem);
          }

          .articula-hero-description {
            margin-top: 1rem;
          }

          .articula-hero-actions {
            margin-top: 1.25rem;
          }

          .articula-product {
            margin-top: 2.75rem;
          }

          .articula-flow {
            margin-top: 2.5rem;
          }
        }

        /*
         * Very short desktop screens.
         */
        @media (min-width: 768px) and (max-height: 680px) {
          .articula-hero {
            padding-top: 4.5rem;
            padding-bottom: 2.5rem;
          }

          .articula-hero-headline {
            font-size: clamp(3.1rem, 5.8vw, 4.8rem);
          }

          .articula-hero-description {
            margin-top: 0.8rem;
          }

          .articula-hero-actions {
            margin-top: 1rem;
          }

          .articula-product {
            margin-top: 2.25rem;
          }

          .articula-flow {
            margin-top: 2rem;
          }
        }

        /*
         * Large desktop.
         */
        @media (min-width: 1400px) and (min-height: 800px) {
          .articula-hero {
            padding-top: 8rem;
            padding-bottom: 6rem;
          }

          .articula-product {
            margin-top: 4.5rem;
          }

          .articula-flow {
            margin-top: 4.5rem;
          }
        }

        /*
         * Mobile.
         */
        @media (max-width: 767px) {
          .articula-hero {
            padding-top: 5.5rem;
            padding-bottom: 4rem;
          }

          .articula-hero-headline {
            font-size: clamp(3.25rem, 16vw, 5rem);
            line-height: 0.9;
          }

          .articula-hero-description {
            margin-top: 1.5rem;
          }

          .articula-hero-actions {
            margin-top: 1.5rem;
          }

          .articula-product {
            margin-top: 3rem;
          }

          .articula-flow {
            margin-top: 3rem;
          }
        }
      `}</style>

      <Navbar />

      <main>
        {/* =====================================================
            HERO
        ====================================================== */}

        <section
          className="
            articula-hero
            relative
            overflow-hidden
            px-4
            text-center
            sm:px-6
            md:px-8
          "
        >
          {/* ===================================================
              SIDE REASONING ORBITS
          ==================================================== */}

          <div className="articula-side-orbits pointer-events-none absolute inset-0 overflow-hidden">
            {/* LEFT OUTER ORBIT */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 34,
                repeat: Infinity,
                ease: "linear",
              }}
              className="
                articula-left-outer
                absolute
                left-[clamp(-340px,-24vw,-180px)]
                top-[clamp(145px,17vw,210px)]
                hidden
                h-[clamp(290px,31vw,390px)]
                w-[clamp(520px,57vw,700px)]
                md:block
              "
            >
              <div className="absolute inset-0 rounded-[50%] border border-black/[0.13] dark:border-white/[0.14]" />

              <div className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5B7CFA] shadow-[0_0_14px_rgba(91,124,250,0.28)] dark:bg-[#6D8BFF] dark:shadow-[0_0_14px_rgba(109,139,255,0.30)]" />

              <div className="absolute right-0 top-1/2 h-2 w-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-black/45 dark:bg-white/50" />

              <div className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-black/30 dark:bg-white/35" />
            </motion.div>

            {/* LEFT INNER ORBIT */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{
                duration: 24,
                repeat: Infinity,
                ease: "linear",
              }}
              className="
                articula-left-inner
                absolute
                left-[clamp(-230px,-18vw,-130px)]
                top-[clamp(200px,23vw,275px)]
                hidden
                h-[clamp(210px,23vw,280px)]
                w-[clamp(390px,43vw,520px)]
                md:block
              "
            >
              <div className="absolute inset-0 rounded-[50%] border border-black/[0.09] dark:border-white/[0.10]" />

              <div className="absolute left-0 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/50 shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:bg-white/55 dark:shadow-[0_0_10px_rgba(255,255,255,0.1)]" />

              <div className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-black/30 dark:bg-white/35" />
            </motion.div>

            {/* RIGHT OUTER ORBIT */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{
                duration: 38,
                repeat: Infinity,
                ease: "linear",
              }}
              className="
                articula-right-outer
                absolute
                right-[clamp(-340px,-24vw,-180px)]
                top-[clamp(145px,17vw,210px)]
                hidden
                h-[clamp(290px,31vw,390px)]
                w-[clamp(520px,57vw,700px)]
                md:block
              "
            >
              <div className="absolute inset-0 rounded-[50%] border border-black/[0.13] dark:border-white/[0.14]" />

              <div className="absolute right-1/2 top-0 h-2.5 w-2.5 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5B7CFA] shadow-[0_0_14px_rgba(91,124,250,0.28)] dark:bg-[#6D8BFF] dark:shadow-[0_0_14px_rgba(109,139,255,0.30)]" />

              <div className="absolute left-0 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/45 dark:bg-white/50" />

              <div className="absolute bottom-0 right-1/2 h-1.5 w-1.5 translate-x-1/2 translate-y-1/2 rounded-full bg-black/30 dark:bg-white/35" />
            </motion.div>

            {/* RIGHT INNER ORBIT */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 27,
                repeat: Infinity,
                ease: "linear",
              }}
              className="
                articula-right-inner
                absolute
                right-[clamp(-230px,-18vw,-130px)]
                top-[clamp(200px,23vw,275px)]
                hidden
                h-[clamp(210px,23vw,280px)]
                w-[clamp(390px,43vw,520px)]
                md:block
              "
            >
              <div className="absolute inset-0 rounded-[50%] border border-black/[0.09] dark:border-white/[0.10]" />

              <div className="absolute right-0 top-1/2 h-2.5 w-2.5 translate-x-1/2 -translate-y-1/2 rounded-full bg-black/50 shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:bg-white/55 dark:shadow-[0_0_10px_rgba(255,255,255,0.1)]" />

              <div className="absolute bottom-0 right-1/2 h-1.5 w-1.5 translate-x-1/2 translate-y-1/2 rounded-full bg-black/30 dark:bg-white/35" />
            </motion.div>
          </div>

          {/* HERO CONTENT */}

          <div className="relative z-10 mx-auto max-w-[1100px]">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-black/45 dark:text-white/45"
            >
              DSA practice for better problem solving
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.05 }}
              className="articula-hero-headline mx-auto mt-5 max-w-[1000px] font-display font-medium leading-[0.9] tracking-[-0.055em]"
            >
              Articulate
              <br />
              Everything.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="articula-hero-description mx-auto max-w-[620px] text-sm leading-6 text-black/55 sm:text-base sm:leading-7 dark:text-white/55"
            >
              Don&apos;t just solve problems. Articulate your solutions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="articula-hero-actions flex flex-wrap items-center justify-center gap-3"
            >
              <motion.button
                onClick={() => navigate("/problems")}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-black"
              >
                Start practicing
              </motion.button>

              <motion.button
                onClick={scrollToMethod}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full border border-black/15 bg-white/60 px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-white dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]"
              >
                See how it works ↓
              </motion.button>
            </motion.div>

            {/* PRODUCT PREVIEW */}

            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="articula-product relative mx-auto w-full max-w-[920px]"
            >
              <div className="overflow-hidden rounded-2xl border border-black/10 bg-white text-left shadow-[0_30px_80px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-[#1b1b1b] dark:shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
                <div className="flex items-center justify-between gap-4 border-b border-black/10 px-4 py-4 sm:px-5 dark:border-white/10">
                  <div className="min-w-0">
                    <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-black/40 dark:text-white/40">
                      Articula
                    </p>

                    <p className="mt-1 truncate font-display text-base sm:text-lg">
                      Longest Substring Without Repeating Characters
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full border border-black/10 px-3 py-1 text-[9px] uppercase tracking-[0.15em] text-black/45 dark:border-white/10 dark:text-white/45">
                    Medium
                  </span>
                </div>

                <div className="grid md:grid-cols-[1.05fr_0.95fr]">
                  <div className="border-b border-black/10 p-4 sm:p-5 dark:border-white/10 md:border-b-0 md:border-r">
                    <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-black/40 dark:text-white/40">
                      Explain your approach
                    </p>

                    <p className="mt-4 max-w-[470px] text-sm leading-6 text-black/60 dark:text-white/60">
                      I&apos;ll use a sliding window with a hash map to keep
                      track of the most recent index of each character...
                    </p>

                    <div className="mt-6 rounded-xl bg-[#F7F7F5] p-4 dark:bg-[#222222]">
                      <p className="text-[9px] uppercase tracking-[0.14em] text-black/40 dark:text-white/40">
                        Your reasoning
                      </p>

                      <div className="mt-3 space-y-2">
                        <div className="h-2 w-[88%] rounded-full bg-black/[0.08] dark:bg-white/[0.08]" />
                        <div className="h-2 w-[72%] rounded-full bg-black/[0.08] dark:bg-white/[0.08]" />
                        <div className="h-2 w-[81%] rounded-full bg-black/[0.08] dark:bg-white/[0.08]" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-black/40 dark:text-white/40">
                      Evaluation
                    </p>

                    <div className="mt-5 space-y-4">
                      {[
                        ["Problem understanding", "92%"],
                        ["Approach", "88%"],
                        ["Complexity", "96%"],
                        ["Articulation", "78%"],
                      ].map(([label, width]) => (
                        <div key={label}>
                          <div className="flex items-center justify-between gap-3 text-[10px]">
                            <span className="truncate text-black/55 dark:text-white/55">
                              {label}
                            </span>

                            <span className="font-medium">{width}</span>
                          </div>

                          <div className="mt-2 h-1 rounded-full bg-black/[0.07] dark:bg-white/[0.09]">
                            <div
                              className="h-full rounded-full bg-[#5B7CFA] dark:bg-[#6D8BFF]"
                              style={{ width }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-7 border-t border-black/10 pt-5 dark:border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#5B7CFA] shadow-[0_0_8px_rgba(91,124,250,0.28)] dark:bg-[#6D8BFF]" />

                        <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-black/40 dark:text-white/40">
                          Example recommendation
                        </p>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-black/60 dark:text-white/60">
                        Your approach is strong. Focus next on explaining why
                        the sliding window guarantees linear time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* FLOW */}

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7 }}
              className="articula-flow mx-auto max-w-[900px]"
            >
              <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-6">
                {methodSteps.map((step) => (
                  <div key={step.number} className="text-center">
                    <p className="font-display text-2xl text-black/20 dark:text-white/20">
                      {step.number}
                    </p>

                    <h3 className="mt-2 font-display text-base">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-black/50 dark:text-white/50">
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* =====================================================
            ARTICULA METHOD
        ====================================================== */}

        <section
          id="articula-method"
          className="border-t border-black/[0.08] px-5 py-20 dark:border-white/[0.08] sm:px-6 sm:py-24 md:px-16"
        >
          <div className="mx-auto max-w-[1200px]">
            <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6 }}
              >
                <p className="mb-4 font-sans text-xs font-medium uppercase tracking-[0.18em] text-black/50 sm:text-sm dark:text-white/50">
                  The Articula method
                </p>

                <h2 className="font-display text-4xl leading-[1.05] tracking-[-0.04em] sm:text-5xl md:text-6xl">
                  Thinking is
                  <br />
                  <span className="text-black/30 dark:text-white/30">
                    part of the solution.
                  </span>
                </h2>

                <p className="mt-6 max-w-[430px] text-sm leading-6 text-black/55 sm:text-base dark:text-white/55">
                  Getting the right answer is only one part of solving a DSA
                  problem. Articula trains the reasoning and communication that
                  happen before, during, and after the code.
                </p>

                <button
                  onClick={() => navigate("/problems")}
                  className="mt-6 text-sm font-medium underline decoration-black/20 underline-offset-4 transition-colors hover:decoration-black dark:decoration-white/20 dark:hover:decoration-white"
                >
                  Start practicing →
                </button>
              </motion.div>

              <div className="space-y-8">
                {methodSteps.map((step, index) => (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.5, delay: index * 0.06 }}
                    className="grid grid-cols-[50px_1fr] gap-5 border-b border-black/[0.08] pb-8 last:border-b-0 dark:border-white/[0.08]"
                  >
                    <span className="font-display text-lg text-black/25 dark:text-white/25">
                      {step.number}
                    </span>

                    <div>
                      <h3 className="font-display text-xl">
                        {step.title}
                      </h3>

                      <p className="mt-2 max-w-[560px] text-sm leading-6 text-black/55 dark:text-white/55">
                        {step.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            ADAPTIVE PRACTICE
        ====================================================== */}

        <section className="border-t border-black/[0.08] px-5 py-20 dark:border-white/[0.08] sm:px-6 sm:py-24 md:px-16">
          <div className="mx-auto max-w-[1200px]">
            <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-20">
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6 }}
                className="order-2 md:order-1"
              >
                <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_25px_70px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-[#1b1b1b] dark:shadow-[0_25px_70px_rgba(0,0,0,0.2)]">
                  <div className="border-b border-black/10 px-5 py-4 dark:border-white/10">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.17em] text-black/40 dark:text-white/40">
                          Adaptive practice
                        </p>

                        <h3 className="mt-1 font-display text-lg">
                          Your next step.
                        </h3>
                      </div>

                      <span className="flex shrink-0 items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-black/40 dark:text-white/40">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#5B7CFA] shadow-[0_0_8px_rgba(91,124,250,0.28)] dark:bg-[#6D8BFF]" />
                        Adaptive
                      </span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="rounded-xl bg-[#F7F7F5] p-5 dark:bg-[#222222]">
                      <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-black/40 dark:text-white/40">
                        Current focus
                      </p>

                      <p className="mt-3 font-display text-xl">
                        Complexity analysis
                      </p>

                      <p className="mt-2 text-sm leading-6 text-black/55 dark:text-white/55">
                        Clearly state time and space complexity and connect it
                        to your implementation.
                      </p>

                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-black/10 px-3 py-1 text-[9px] uppercase tracking-[0.12em] text-black/45 dark:border-white/10 dark:text-white/45">
                          Medium
                        </span>

                        <span className="text-[10px] text-black/40 dark:text-white/40">
                          Recommended next
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      {adaptiveSteps.map((step) => (
                        <div
                          key={step.number}
                          className="flex gap-4 border-b border-black/[0.07] pb-3 last:border-b-0 dark:border-white/[0.07]"
                        >
                          <span className="font-display text-sm text-black/25 dark:text-white/25">
                            {step.number}
                          </span>

                          <div>
                            <p className="text-sm font-medium">
                              {step.title}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-black/45 dark:text-white/45">
                              {step.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6 }}
                className="order-1 md:order-2"
              >
                <p className="mb-4 font-sans text-xs font-medium uppercase tracking-[0.18em] text-black/50 sm:text-sm dark:text-white/50">
                  Adaptive DSA practice
                </p>

                <h2 className="font-display text-4xl leading-[1.05] tracking-[-0.04em] sm:text-5xl md:text-6xl">
                  Practice that
                  <br />
                  <span className="text-black/30 dark:text-white/30">
                    responds to you.
                  </span>
                </h2>

                <p className="mt-6 max-w-[450px] text-sm leading-6 text-black/55 sm:text-base dark:text-white/55">
                  Your previous attempts shape what comes next. Articula looks
                  at your performance and chooses a useful next challenge
                  instead of simply giving you another random problem.
                </p>

                <button
                  onClick={() => navigate("/interactive")}
                  className="mt-6 text-sm font-medium underline decoration-black/20 underline-offset-4 transition-colors hover:decoration-black dark:decoration-white/20 dark:hover:decoration-white"
                >
                  Try adaptive practice →
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* =====================================================
            DASHBOARD / PROGRESS
        ====================================================== */}

        <section className="border-t border-black/[0.08] px-5 py-20 dark:border-white/[0.08] sm:px-6 sm:py-24 md:px-16">
          <div className="mx-auto max-w-[1350px]">
            <div className="grid gap-10 md:grid-cols-[0.7fr_1.3fr] md:items-center md:gap-12">
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6 }}
              >
                <p className="mb-4 font-sans text-xs font-medium uppercase tracking-[0.18em] text-black/50 sm:text-sm dark:text-white/50">
                  Your progress
                </p>

                <h2 className="font-display text-3xl leading-tight tracking-[-0.03em] sm:text-4xl md:text-5xl">
                  See your
                  <br />
                  <span className="text-black/35 dark:text-white/35">
                    progress compound.
                  </span>
                </h2>

                <p className="mt-5 max-w-[430px] text-sm leading-6 text-black/55 sm:mt-6 dark:text-white/55">
                  Every problem, articulation, execution result, and evaluation
                  contributes to a clearer picture of how you are improving.
                </p>

                <button
                  onClick={() => navigate("/dashboard")}
                  className="mt-6 text-sm font-medium underline decoration-black/20 underline-offset-4 transition-colors hover:decoration-black sm:mt-7 dark:decoration-white/20 dark:hover:decoration-white"
                >
                  View your dashboard →
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6 }}
                className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:rounded-2xl dark:border-white/10 dark:bg-[#1b1b1b] dark:shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
              >
                <div className="flex items-center justify-between gap-4 border-b border-black/10 px-5 py-4 sm:px-6 sm:py-5 dark:border-white/10">
                  <div>
                    <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-black/40 sm:text-[10px] dark:text-white/40">
                      Dashboard
                    </p>

                    <h3 className="mt-1 font-display text-lg sm:text-xl">
                      Your progress.
                    </h3>
                  </div>

                  <span className="shrink-0 text-[9px] uppercase tracking-[0.15em] text-black/35 sm:text-[10px] dark:text-white/35">
                    Overview
                  </span>
                </div>

                <div className="grid grid-cols-2 border-b border-black/10 sm:grid-cols-4 dark:border-white/10">
                  {[
                    ["Sessions", "12"],
                    ["Avg. Score", "4.3"],
                    ["Test Pass", "94%"],
                    ["Problems", "8"],
                  ].map(([label, value], index) => (
                    <div
                      key={label}
                      className={`
                        p-4 sm:p-5
                        ${
                          index % 2 === 0
                            ? "border-r border-black/10 sm:border-r dark:border-white/10"
                            : ""
                        }
                        ${
                          index < 2
                            ? "border-b border-black/10 sm:border-b-0 dark:border-white/10"
                            : ""
                        }
                        ${
                          index === 1
                            ? "sm:border-r border-black/10 dark:border-white/10"
                            : ""
                        }
                        ${
                          index === 2
                            ? "sm:border-r border-black/10 dark:border-white/10"
                            : ""
                        }
                      `}
                    >
                      <p className="text-[9px] uppercase tracking-[0.14em] text-black/40 sm:text-[10px] dark:text-white/40">
                        {label}
                      </p>

                      <p className="mt-2 font-display text-xl sm:text-2xl">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-[1.15fr_0.85fr]">
                  <div className="border-b border-black/10 p-5 sm:p-6 md:border-b-0 md:border-r dark:border-white/10">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-black/40 sm:text-[10px] dark:text-white/40">
                        Articulation over time
                      </p>

                      <span className="hidden text-[10px] text-black/35 sm:block dark:text-white/35">
                        Recent sessions
                      </span>
                    </div>

                    <div className="relative mt-6 h-[130px] sm:mt-7 sm:h-[145px]">
                      <div className="absolute inset-x-0 top-0 border-t border-black/[0.07] dark:border-white/[0.07]" />

                      <div className="absolute inset-x-0 top-1/3 border-t border-black/[0.07] dark:border-white/[0.07]" />

                      <div className="absolute inset-x-0 top-2/3 border-t border-black/[0.07] dark:border-white/[0.07]" />

                      <div className="absolute inset-x-0 bottom-0 border-t border-black/[0.07] dark:border-white/[0.07]" />

                      <svg
                        viewBox="0 0 500 150"
                        className="absolute inset-0 h-full w-full overflow-visible text-[#5B7CFA] dark:text-[#6D8BFF]"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0 125 C45 119, 55 112, 90 115 S140 103, 175 106 S220 87, 260 91 S310 78, 345 82 S390 60, 425 67 S465 48, 500 35"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          vectorEffect="non-scaling-stroke"
                        />

                        <circle
                          cx="90"
                          cy="115"
                          r="3"
                          fill="currentColor"
                        />

                        <circle
                          cx="175"
                          cy="106"
                          r="3"
                          fill="currentColor"
                        />

                        <circle
                          cx="260"
                          cy="91"
                          r="3"
                          fill="currentColor"
                        />

                        <circle
                          cx="345"
                          cy="82"
                          r="3"
                          fill="currentColor"
                        />

                        <circle
                          cx="425"
                          cy="67"
                          r="3"
                          fill="currentColor"
                        />

                        <circle
                          cx="500"
                          cy="35"
                          r="4"
                          fill="currentColor"
                        />
                      </svg>

                      <div className="absolute bottom-[-18px] left-0 right-0 flex justify-between text-[8px] text-black/30 sm:text-[9px] dark:text-white/30">
                        <span>1</span>
                        <span>4</span>
                        <span>8</span>
                        <span>12</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-black/40 sm:text-[10px] dark:text-white/40">
                      Skill breakdown
                    </p>

                    <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
                      {dashboardSkills.map(([label, score, width]) => (
                        <div key={label}>
                          <div className="flex items-center justify-between gap-3 text-[9px] sm:text-[10px]">
                            <span className="truncate text-black/55 dark:text-white/55">
                              {label}
                            </span>

                            <span className="font-medium">{score}</span>
                          </div>

                          <div className="mt-1.5 h-1 rounded-full bg-black/[0.07] dark:bg-white/[0.09]">
                            <div
                              className="h-full rounded-full bg-[#5B7CFA] dark:bg-[#6D8BFF]"
                              style={{ width }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-black/10 px-5 py-3.5 sm:px-6 sm:py-4 dark:border-white/10">
                  <p className="text-[8px] uppercase tracking-[0.14em] text-black/35 sm:text-[10px] dark:text-white/35">
                    Your progress is built from what you actually practice.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}

export default Home;