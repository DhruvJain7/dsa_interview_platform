import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  const navigate = useNavigate();

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
        /* =====================================================
           HERO BASE
        ====================================================== */

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

        /* =====================================================
           SMALLER LAPTOP WIDTHS

           Bring the large side orbits inward so they don't
           disappear almost completely off-screen.
        ====================================================== */

        @media (min-width: 768px) and (max-width: 1400px) {
          .articula-left-outer {
            left: -270px !important;
            width: 610px !important;
          }

          .articula-left-inner {
            left: -185px !important;
            width: 455px !important;
          }

          .articula-right-outer {
            right: -270px !important;
            width: 610px !important;
          }

          .articula-right-inner {
            right: -185px !important;
            width: 455px !important;
          }
        }

        /* =====================================================
           SHORT LAPTOP VIEWPORT
        ====================================================== */

        @media (min-width: 768px) and (max-height: 760px) {
          .articula-hero {
            padding-top: 5.5rem;
            padding-bottom: 3rem;
          }

          .articula-hero-headline {
            font-size: clamp(3.5rem, 7vw, 5.8rem);
          }

          .articula-hero-description {
            margin-top: 1.15rem;
          }

          .articula-hero-actions {
            margin-top: 1.25rem;
          }

          .articula-product {
            margin-top: 2.5rem;
            transform: scale(0.92);
            transform-origin: top center;
            margin-bottom: -2.5rem;
          }

          .articula-flow {
            margin-top: 2rem;
            transform: scale(0.82);
            transform-origin: top center;
            margin-bottom: -2.5rem;
          }

          .articula-side-orbits {
            transform: scaleY(0.82);
            transform-origin: center;
          }
        }

        /* =====================================================
           VERY SHORT LAPTOP
        ====================================================== */

        @media (min-width: 768px) and (max-height: 650px) {
          .articula-hero {
            padding-top: 4.75rem;
            padding-bottom: 2rem;
          }

          .articula-hero-headline {
            font-size: clamp(3.2rem, 6.5vw, 5rem);
          }

          .articula-hero-description {
            margin-top: 0.9rem;
          }

          .articula-hero-actions {
            margin-top: 1rem;
          }

          .articula-product {
            margin-top: 2rem;
            transform: scale(0.84);
            margin-bottom: -4rem;
          }

          .articula-flow {
            margin-top: 1.25rem;
            transform: scale(0.72);
            margin-bottom: -4rem;
          }

          .articula-side-orbits {
            transform: scale(0.82);
          }
        }

        /* =====================================================
           LARGE / TALL SCREENS
        ====================================================== */

        @media (min-width: 1280px) and (min-height: 800px) {
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
            {/* =================================================
                LEFT OUTER ORBIT
            ================================================== */}
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

              {/* Node attached to top of orbit */}
              <div className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/60 shadow-[0_0_12px_rgba(0,0,0,0.12)] dark:bg-white/65 dark:shadow-[0_0_12px_rgba(255,255,255,0.12)]" />

              {/* Node attached to right of orbit */}
              <div className="absolute right-0 top-1/2 h-2 w-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-black/45 dark:bg-white/50" />

              {/* Node attached to bottom of orbit */}
              <div className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-black/30 dark:bg-white/35" />
            </motion.div>

            {/* =================================================
                LEFT INNER ORBIT
            ================================================== */}
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

            {/* =================================================
                RIGHT OUTER ORBIT
            ================================================== */}
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

              {/* Node attached to top of orbit */}
              <div className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/60 shadow-[0_0_12px_rgba(0,0,0,0.12)] dark:bg-white/65 dark:shadow-[0_0_12px_rgba(255,255,255,0.12)]" />

              {/* Node attached to left of orbit */}
              <div className="absolute left-0 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/45 dark:bg-white/50" />

              {/* Node attached to bottom of orbit */}
              <div className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-black/30 dark:bg-white/35" />
            </motion.div>

            {/* =================================================
                RIGHT INNER ORBIT
            ================================================== */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 26,
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

              <div className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/30 dark:bg-white/35" />
            </motion.div>

            {/* =================================================
                CENTER MASK
            ================================================== */}
            <div className="absolute left-1/2 top-[70px] h-[clamp(470px,55vw,620px)] w-[clamp(330px,52vw,620px)] -translate-x-1/2 rounded-full bg-[#F7F7F5]/90 blur-3xl dark:bg-[#222222]/90" />
          </div>

          {/* ===================================================
              HERO CONTENT
          ==================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="relative z-20 mx-auto w-full max-w-[1000px]"
          >
            <p className="mb-4 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-black/50 sm:mb-5 sm:text-xs dark:text-white/45">
              AI-powered DSA practice
            </p>

            <h1 className="articula-hero-headline font-display leading-[0.88] tracking-[-0.055em]">
              Articulate
              <br />
              Everything.
            </h1>

            <p className="articula-hero-description mx-auto max-w-[600px] font-sans text-sm font-medium leading-6 tracking-tight text-black/60 sm:text-base sm:leading-7 md:text-lg dark:text-white/60">
              Don't just solve problems. Articulate your solutions.
            </p>

            <div className="articula-hero-actions flex flex-wrap items-center justify-center gap-3">
              <motion.button
                onClick={() => navigate("/problems")}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group rounded-full bg-black px-6 py-3 text-xs font-medium text-white transition-colors hover:bg-[#292929] sm:px-7 sm:py-3.5 sm:text-sm dark:bg-white dark:text-black dark:hover:bg-[#eeeeee]"
              >
                Start Practicing

                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </motion.button>

              <motion.button
                onClick={() => navigate("/problems")}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full border border-black/15 px-6 py-3 text-xs font-medium text-black transition-colors hover:bg-black/5 sm:px-7 sm:py-3.5 sm:text-sm dark:border-white/15 dark:text-white dark:hover:bg-white/10"
              >
                Explore Problems
              </motion.button>
            </div>
          </motion.div>

          {/* ===================================================
              PRODUCT PREVIEW
          ==================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="articula-product relative z-20 mx-auto w-full max-w-[760px] text-left"
          >
            <div className="overflow-hidden rounded-xl border border-black/[0.09] bg-white shadow-[0_25px_80px_rgba(0,0,0,0.07)] sm:rounded-2xl dark:border-white/[0.1] dark:bg-[#1b1b1b] dark:shadow-[0_25px_80px_rgba(0,0,0,0.25)]">
              <div className="flex items-center justify-between border-b border-black/[0.08] px-4 py-3 sm:px-5 sm:py-4 dark:border-white/[0.08]">
                <div>
                  <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-black/40 sm:text-[10px] dark:text-white/40">
                    Practice
                  </p>

                  <h3 className="mt-1 font-display text-base tracking-tight sm:text-lg">
                    Two Sum
                  </h3>
                </div>

                <span className="rounded-full border border-black/10 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-black/50 sm:px-3 sm:text-[10px] dark:border-white/10 dark:text-white/50">
                  Easy
                </span>
              </div>

              <div className="grid md:grid-cols-[1.3fr_0.7fr]">
                <div className="border-b border-black/[0.08] p-5 sm:p-6 md:border-b-0 md:border-r dark:border-white/[0.08]">
                  <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-black/40 sm:text-[10px] dark:text-white/40">
                    Your articulation
                  </p>

                  <p className="mt-3 max-w-[470px] font-sans text-xs leading-5 text-black/70 sm:mt-4 sm:text-sm sm:leading-6 dark:text-white/65">
                    "I'll use a hash map to store the values I've already
                    seen. For each number, I'll check whether its complement
                    already exists."
                  </p>

                  <div className="mt-5 flex items-center gap-2 sm:mt-6">
                    <span className="h-1.5 w-1.5 rounded-full bg-black dark:bg-white" />

                    <span className="text-[10px] font-medium text-black/50 sm:text-[11px] dark:text-white/50">
                      Reasoning captured
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-black/40 sm:text-[10px] dark:text-white/40">
                    Evaluation
                  </p>

                  <div className="mt-4 space-y-4 sm:mt-5">
                    {[
                      ["Approach", "4.5", "90%"],
                      ["Complexity", "5.0", "100%"],
                      ["Clarity", "4.0", "80%"],
                    ].map(([label, score, width]) => (
                      <div key={label}>
                        <div className="flex items-center justify-between text-[10px] sm:text-[11px]">
                          <span className="text-black/55 dark:text-white/55">
                            {label}
                          </span>

                          <span className="font-medium">{score}</span>
                        </div>

                        <div className="mt-2 h-1 rounded-full bg-black/[0.08] dark:bg-white/[0.1]">
                          <div
                            className="h-full rounded-full bg-black dark:bg-white"
                            style={{ width }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-black/[0.08] px-4 py-3 sm:px-5 sm:py-3.5 dark:border-white/[0.08]">
                <span className="text-[8px] uppercase tracking-[0.15em] text-black/35 sm:text-[10px] dark:text-white/35">
                  Solve → Articulate → Evaluate
                </span>

                <span className="text-[10px] font-medium text-black/50 sm:text-[11px] dark:text-white/50">
                  Articula
                </span>
              </div>
            </div>
          </motion.div>

          {/* ===================================================
              ARTICULA FLOW
          ==================================================== */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="articula-flow relative z-10 mx-auto w-full max-w-[620px]"
          >
            <div className="relative h-[155px] sm:h-[180px] md:h-[210px]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 40,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute left-1/2 top-1/2 h-[110px] w-[310px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-black/[0.12] sm:h-[145px] sm:w-[430px] dark:border-white/[0.11]"
              />

              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 28,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute left-1/2 top-1/2 h-[78px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-black/[0.08] sm:h-[100px] sm:w-[290px] dark:border-white/[0.075]"
              />

              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-[#F7F7F5] sm:h-12 sm:w-12 dark:border-white/10 dark:bg-[#222222]"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="h-2 w-2 rounded-full bg-black dark:bg-white"
                />
              </motion.div>

              <span className="absolute left-[2%] top-[42%] rounded-full border border-black/10 bg-white px-2.5 py-1 text-[8px] font-medium uppercase tracking-[0.18em] text-black/50 sm:px-3 sm:py-1.5 sm:text-[9px] dark:border-white/10 dark:bg-[#222222] dark:text-white/45">
                Think
              </span>

              <span className="absolute right-0 top-[42%] rounded-full border border-black/10 bg-white px-2.5 py-1 text-[8px] font-medium uppercase tracking-[0.18em] text-black/50 sm:px-3 sm:py-1.5 sm:text-[9px] dark:border-white/10 dark:bg-[#222222] dark:text-white/45">
                Articulate
              </span>

              <span className="absolute bottom-[1%] left-[20%] rounded-full border border-black/10 bg-white px-2.5 py-1 text-[8px] font-medium uppercase tracking-[0.18em] text-black/50 sm:px-3 sm:py-1.5 sm:text-[9px] dark:border-white/10 dark:bg-[#222222] dark:text-white/45">
                Code
              </span>

              <span className="absolute bottom-[1%] right-[20%] rounded-full border border-black/10 bg-white px-2.5 py-1 text-[8px] font-medium uppercase tracking-[0.18em] text-black/50 sm:px-3 sm:py-1.5 sm:text-[9px] dark:border-white/10 dark:bg-[#222222] dark:text-white/45">
                Improve
              </span>
            </div>
          </motion.div>
        </section>

        {/* =====================================================
            ARTICULA METHOD
        ====================================================== */}
        <section className="border-t border-black/[0.08] px-5 py-20 dark:border-white/[0.08] sm:px-6 sm:py-24 md:px-16">
          <div className="mx-auto max-w-[1350px]">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="max-w-[650px]"
            >
              <p className="mb-4 font-sans text-xs font-medium uppercase tracking-[0.18em] text-black/50 sm:text-sm dark:text-white/50">
                The Articula Method
              </p>

              <h2 className="font-display text-3xl leading-tight tracking-[-0.03em] sm:text-4xl md:text-5xl">
                Don't just write the answer.
                <br />

                <span className="text-black/35 dark:text-white/35">
                  Explain how you got there.
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.12,
                  },
                },
              }}
              className="mt-12 grid grid-cols-1 border-y border-black/15 dark:border-white/15 md:mt-16 md:grid-cols-4"
            >
              {methodSteps.map((step, index) => (
                <motion.div
                  key={step.number}
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 20,
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.5,
                      },
                    },
                  }}
                  className={`py-7 sm:py-8 ${
                    index < 3
                      ? "border-b border-black/15 md:border-b-0 md:border-r md:px-8 dark:border-white/15"
                      : "md:pl-8"
                  }`}
                >
                  <span className="font-sans text-xs font-medium text-black/40 dark:text-white/40">
                    {step.number}
                  </span>

                  <h3 className="mt-6 font-display text-2xl sm:mt-7 sm:text-3xl">
                    {step.title}
                  </h3>

                  <p className="mt-3 font-sans text-sm leading-6 text-black/60 sm:mt-4 dark:text-[#A3A3A3]">
                    {step.text}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* =====================================================
            ADAPTIVE PRACTICE
        ====================================================== */}
        <section className="border-t border-black/[0.08] bg-black/[0.025] px-5 py-20 dark:border-white/[0.08] dark:bg-white/[0.025] sm:px-6 sm:py-24 md:px-16">
          <div className="mx-auto max-w-[1350px]">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6 }}
              className="max-w-[680px]"
            >
              <p className="mb-4 font-sans text-xs font-medium uppercase tracking-[0.18em] text-black/50 sm:text-sm dark:text-white/50">
                Adaptive Practice
              </p>

              <h2 className="font-display text-3xl leading-tight tracking-[-0.03em] sm:text-4xl md:text-5xl">
                Practice that
                <br />
                <span className="text-black/35 dark:text-white/35">
                  adapts to you.
                </span>
              </h2>

              <p className="mt-5 max-w-[580px] font-sans text-sm leading-6 text-black/60 sm:mt-6 dark:text-[#A3A3A3]">
                Articula looks at how you've been solving, explaining, and
                improving. Its adaptive practice system uses that history to
                decide what you should work on next.
              </p>
            </motion.div>

            <div className="mt-12 grid gap-4 sm:mt-16 sm:gap-5 md:grid-cols-4">
              {adaptiveSteps.map((item, index) => (
                <motion.div
                  key={item.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  className="relative rounded-xl border border-black/10 bg-white p-5 sm:p-6 dark:border-white/10 dark:bg-[#1b1b1b]"
                >
                  <span className="text-xs font-medium text-black/35 dark:text-white/35">
                    {item.number}
                  </span>

                  <h3 className="mt-5 font-display text-xl sm:mt-6 sm:text-2xl">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-black/55 dark:text-white/55">
                    {item.text}
                  </p>

                  {index < 3 && (
                    <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-black/25 md:block dark:text-white/25">
                      →
                    </span>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6 }}
              className="mt-6 grid overflow-hidden rounded-2xl border border-black/10 bg-white sm:mt-8 dark:border-white/10 dark:bg-[#1b1b1b] md:grid-cols-[1fr_auto]"
            >
              <div className="p-6 sm:p-7 md:p-8">
                <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-black/40 sm:text-[10px] dark:text-white/40">
                  Example recommendation
                </p>

                <h3 className="mt-3 font-display text-xl sm:text-2xl">
                  Focus on complexity articulation.
                </h3>

                <p className="mt-3 max-w-[650px] text-sm leading-6 text-black/55 dark:text-white/55">
                  You've been consistently solving problems correctly. Your
                  next practice can focus on making the reasoning behind your
                  complexity analysis more precise.
                </p>
              </div>

              <div className="flex items-center border-t border-black/10 p-6 sm:p-7 md:border-l md:border-t-0 md:p-8 dark:border-white/10">
                <motion.button
                  onClick={() => navigate("/interactive")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-full bg-black px-6 py-3 text-sm font-medium text-white md:w-auto dark:bg-white dark:text-black"
                >
                  Try Adaptive Practice →
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* =====================================================
            TWO WAYS TO PRACTICE
        ====================================================== */}
        <section className="px-5 py-20 sm:px-6 sm:py-24 md:px-16">
          <div className="mx-auto max-w-[1100px]">
            <div className="text-center">
              <p className="mb-4 font-sans text-xs font-medium uppercase tracking-[0.18em] text-black/50 sm:text-sm dark:text-white/50">
                Two ways to practice
              </p>

              <h2 className="font-display text-3xl tracking-[-0.03em] sm:text-4xl md:text-5xl">
                You choose.
                <span className="text-black/35 dark:text-white/35">
                  {" "}
                  Or Articula does.
                </span>
              </h2>
            </div>

            <div className="mt-10 grid overflow-hidden rounded-2xl border border-black/10 sm:mt-14 md:grid-cols-2 dark:border-white/10">
              <motion.div
                whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                className="border-b border-black/10 p-7 sm:p-8 md:border-b-0 md:border-r md:p-10 dark:border-white/10 dark:hover:bg-white/[0.02]"
              >
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-black/40 dark:text-white/40">
                  Practice
                </span>

                <h3 className="mt-5 font-display text-2xl sm:text-3xl">
                  You choose the problem.
                </h3>

                <p className="mt-4 text-sm leading-6 text-black/55 dark:text-white/55">
                  Pick a topic, difficulty, and problem. Solve it at your own
                  pace and use Articula to evaluate how you reason and
                  articulate.
                </p>

                <button
                  onClick={() => navigate("/problems")}
                  className="mt-6 text-sm font-medium underline decoration-black/20 underline-offset-4 transition-colors hover:decoration-black sm:mt-7 dark:decoration-white/20 dark:hover:decoration-white"
                >
                  Explore problems →
                </button>
              </motion.div>

              <motion.div
                whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                className="p-7 sm:p-8 md:p-10 dark:hover:bg-white/[0.02]"
              >
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-black/40 dark:text-white/40">
                  Interactive
                </span>

                <h3 className="mt-5 font-display text-2xl sm:text-3xl">
                  Articula chooses what's next.
                </h3>

                <p className="mt-4 text-sm leading-6 text-black/55 dark:text-white/55">
                  Your previous performance becomes context. Articula adapts
                  the next challenge around what you need to improve.
                </p>

                <button
                  onClick={() => navigate("/interactive")}
                  className="mt-6 text-sm font-medium underline decoration-black/20 underline-offset-4 transition-colors hover:decoration-black sm:mt-7 dark:decoration-white/20 dark:hover:decoration-white"
                >
                  Try interactive practice →
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
                {/* Dashboard header */}
                <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 sm:px-6 sm:py-5 dark:border-white/10">
                  <div>
                    <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-black/40 sm:text-[10px] dark:text-white/40">
                      Dashboard
                    </p>

                    <h3 className="mt-1 font-display text-lg sm:text-xl">
                      Your progress.
                    </h3>
                  </div>

                  <span className="text-[9px] uppercase tracking-[0.15em] text-black/35 sm:text-[10px] dark:text-white/35">
                    Overview
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 border-b border-black/10 sm:grid-cols-4 dark:border-white/10">
                  {[
                    ["Sessions", "12"],
                    ["Avg. Score", "4.3"],
                    ["Test Pass", "94%"],
                    ["Problems", "8"],
                  ].map(([label, value], index) => (
                    <div
                      key={label}
                      className={`p-4 sm:p-5 ${
                        index < 3
                          ? "border-r border-black/10 dark:border-white/10"
                          : ""
                      }`}
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
                  {/* Chart */}
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
                        className="absolute inset-0 h-full w-full overflow-visible"
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

                  {/* Skills */}
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
                              className="h-full rounded-full bg-black dark:bg-white"
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