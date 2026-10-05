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

  const dashboardSkills = [
    ["Problem Understanding", "4.6", "92%"],
    ["Approach / Logic", "4.4", "88%"],
    ["Complexity", "4.8", "96%"],
    ["Clarity & Articulation", "3.9", "78%"],
    ["Optimization", "4.2", "84%"],
  ];

  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#222222] dark:text-white">
      <Navbar />

      <main className="relative overflow-hidden">
        {/* =====================================================
            HERO
        ====================================================== */}
        <section className="relative px-6 pb-20 pt-28 text-center md:pt-32">
          {/* ===================================================
              LEFT + RIGHT REASONING ORBITS

              Nodes are positioned directly on the ellipse
              perimeter and rotate with their orbit.
          ==================================================== */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
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
              className="absolute left-[-265px] top-[185px] hidden h-[380px] w-[680px] md:block"
            >
              {/* Ellipse */}
              <div className="absolute inset-0 rounded-[50%] border border-black/[0.15] dark:border-white/[0.14]" />

              {/* TOP NODE — exactly on ellipse */}
              <div className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/60 shadow-[0_0_12px_rgba(0,0,0,0.12)] dark:bg-white/65 dark:shadow-[0_0_12px_rgba(255,255,255,0.12)]" />

              {/* RIGHT NODE — exactly on ellipse */}
              <div className="absolute right-0 top-1/2 h-2 w-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-black/45 dark:bg-white/50" />

              {/* BOTTOM NODE — exactly on ellipse */}
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
              className="absolute left-[-190px] top-[245px] hidden h-[270px] w-[500px] md:block"
            >
              {/* Ellipse */}
              <div className="absolute inset-0 rounded-[50%] border border-black/[0.10] dark:border-white/[0.10]" />

              {/* LEFT NODE — exactly on ellipse */}
              <div className="absolute left-0 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/50 shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:bg-white/55 dark:shadow-[0_0_10px_rgba(255,255,255,0.1)]" />

              {/* BOTTOM NODE — exactly on ellipse */}
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
              className="absolute right-[-265px] top-[185px] hidden h-[380px] w-[680px] md:block"
            >
              {/* Ellipse */}
              <div className="absolute inset-0 rounded-[50%] border border-black/[0.15] dark:border-white/[0.14]" />

              {/* TOP NODE — exactly on ellipse */}
              <div className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/60 shadow-[0_0_12px_rgba(0,0,0,0.12)] dark:bg-white/65 dark:shadow-[0_0_12px_rgba(255,255,255,0.12)]" />

              {/* LEFT NODE — exactly on ellipse */}
              <div className="absolute left-0 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/45 dark:bg-white/50" />

              {/* BOTTOM NODE — exactly on ellipse */}
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
              className="absolute right-[-190px] top-[245px] hidden h-[270px] w-[500px] md:block"
            >
              {/* Ellipse */}
              <div className="absolute inset-0 rounded-[50%] border border-black/[0.10] dark:border-white/[0.10]" />

              {/* RIGHT NODE — exactly on ellipse */}
              <div className="absolute right-0 top-1/2 h-2.5 w-2.5 translate-x-1/2 -translate-y-1/2 rounded-full bg-black/50 shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:bg-white/55 dark:shadow-[0_0_10px_rgba(255,255,255,0.1)]" />

              {/* TOP NODE — exactly on ellipse */}
              <div className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/30 dark:bg-white/35" />
            </motion.div>

            {/* =================================================
                CENTER MASK

                Only masks the center area. The side orbits
                remain clearly visible.
            ================================================== */}
            <div className="absolute left-1/2 top-[90px] h-[540px] w-[580px] -translate-x-1/2 rounded-full bg-white/90 blur-3xl dark:bg-[#222222]/90" />
          </div>

          {/* ===================================================
              HERO CONTENT
          ==================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="relative z-20 mx-auto max-w-[1000px]"
          >
            <p className="mb-5 font-sans text-xs font-medium uppercase tracking-[0.2em] text-black/50 dark:text-white/45">
              AI-powered DSA practice
            </p>

            <h1 className="font-display text-[clamp(4rem,8vw,7rem)] leading-[0.9] tracking-[-0.055em]">
              Articulate
              <br />
              Everything.
            </h1>

            <p className="mx-auto mt-7 max-w-[600px] font-sans text-base font-medium leading-7 tracking-tight text-black/60 dark:text-white/60 md:text-lg">
              Don't just solve problems. Articulate your solutions.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <motion.button
                onClick={() => navigate("/problems")}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group rounded-full bg-black px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#292929] dark:bg-white dark:text-black dark:hover:bg-[#eeeeee]"
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
                className="rounded-full border border-black/15 px-7 py-3.5 text-sm font-medium text-black transition-colors hover:bg-black/5 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
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
            className="relative z-20 mx-auto mt-16 w-full max-w-[760px] text-left"
          >
            <div className="overflow-hidden rounded-2xl border border-black/[0.1] bg-white shadow-[0_25px_80px_rgba(0,0,0,0.08)] dark:border-white/[0.1] dark:bg-[#1b1b1b] dark:shadow-[0_25px_80px_rgba(0,0,0,0.25)]">
              <div className="flex items-center justify-between border-b border-black/[0.08] px-5 py-4 dark:border-white/[0.08]">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-black/40 dark:text-white/40">
                    Practice
                  </p>

                  <h3 className="mt-1 font-display text-lg tracking-tight">
                    Two Sum
                  </h3>
                </div>

                <span className="rounded-full border border-black/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-black/50 dark:border-white/10 dark:text-white/50">
                  Easy
                </span>
              </div>

              <div className="grid md:grid-cols-[1.3fr_0.7fr]">
                <div className="border-b border-black/[0.08] p-6 md:border-b-0 md:border-r dark:border-white/[0.08]">
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-black/40 dark:text-white/40">
                    Your articulation
                  </p>

                  <p className="mt-4 max-w-[470px] font-sans text-sm leading-6 text-black/70 dark:text-white/65">
                    "I'll use a hash map to store the values I've already
                    seen. For each number, I'll check whether its complement
                    already exists."
                  </p>

                  <div className="mt-6 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-black dark:bg-white" />

                    <span className="text-[11px] font-medium text-black/50 dark:text-white/50">
                      Reasoning captured
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-black/40 dark:text-white/40">
                    Evaluation
                  </p>

                  <div className="mt-5 space-y-4">
                    {[
                      ["Approach", "4.5", "90%"],
                      ["Complexity", "5.0", "100%"],
                      ["Clarity", "4.0", "80%"],
                    ].map(([label, score, width]) => (
                      <div key={label}>
                        <div className="flex items-center justify-between text-[11px]">
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

              <div className="flex items-center justify-between border-t border-black/[0.08] px-5 py-3.5 dark:border-white/[0.08]">
                <span className="text-[10px] uppercase tracking-[0.15em] text-black/35 dark:text-white/35">
                  Solve → Articulate → Evaluate
                </span>

                <span className="text-[11px] font-medium text-black/50 dark:text-white/50">
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
            className="relative z-10 mx-auto mt-16 max-w-[620px]"
          >
            <div className="relative h-[180px] md:h-[210px]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 40,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute left-1/2 top-1/2 h-[145px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-black/[0.12] dark:border-white/[0.11]"
              />

              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 28,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute left-1/2 top-1/2 h-[100px] w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-black/[0.08] dark:border-white/[0.075]"
              />

              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white dark:border-white/10 dark:bg-[#222222]"
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

              <span className="absolute left-[3%] top-[42%] rounded-full border border-black/10 bg-white px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-black/50 dark:border-white/10 dark:bg-[#222222] dark:text-white/45">
                Think
              </span>

              <span className="absolute right-[1%] top-[42%] rounded-full border border-black/10 bg-white px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-black/50 dark:border-white/10 dark:bg-[#222222] dark:text-white/45">
                Articulate
              </span>

              <span className="absolute bottom-[3%] left-[25%] rounded-full border border-black/10 bg-white px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-black/50 dark:border-white/10 dark:bg-[#222222] dark:text-white/45">
                Code
              </span>

              <span className="absolute bottom-[3%] right-[25%] rounded-full border border-black/10 bg-white px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-black/50 dark:border-white/10 dark:bg-[#222222] dark:text-white/45">
                Improve
              </span>
            </div>
          </motion.div>
        </section>

        {/* =====================================================
            ARTICULA METHOD
        ====================================================== */}
        <section className="border-t border-black/[0.08] px-6 py-24 dark:border-white/[0.08] md:px-16">
          <div className="mx-auto max-w-[1350px]">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="max-w-[650px]"
            >
              <p className="mb-4 font-sans text-sm font-medium uppercase tracking-[0.18em] text-black/50 dark:text-white/50">
                The Articula Method
              </p>

              <h2 className="font-display text-4xl leading-tight tracking-[-0.03em] md:text-5xl">
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
              className="mt-16 grid grid-cols-1 border-y border-black/15 dark:border-white/15 md:grid-cols-4"
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
                  className={`py-8 ${
                    index < 3
                      ? "border-b border-black/15 md:border-b-0 md:border-r md:px-8 dark:border-white/15"
                      : "md:pl-8"
                  }`}
                >
                  <span className="font-sans text-xs font-medium text-black/40 dark:text-white/40">
                    {step.number}
                  </span>

                  <h3 className="mt-7 font-display text-3xl">
                    {step.title}
                  </h3>

                  <p className="mt-4 font-sans text-sm leading-6 text-black/60 dark:text-[#A3A3A3]">
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
        <section className="border-t border-black/[0.08] bg-black/[0.025] px-6 py-24 dark:border-white/[0.08] dark:bg-white/[0.025] md:px-16">
          <div className="mx-auto max-w-[1350px]">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6 }}
              className="max-w-[680px]"
            >
              <p className="mb-4 font-sans text-sm font-medium uppercase tracking-[0.18em] text-black/50 dark:text-white/50">
                Adaptive Practice
              </p>

              <h2 className="font-display text-4xl leading-tight tracking-[-0.03em] md:text-5xl">
                Practice that
                <br />
                <span className="text-black/35 dark:text-white/35">
                  adapts to you.
                </span>
              </h2>

              <p className="mt-6 max-w-[580px] font-sans text-sm leading-6 text-black/60 dark:text-[#A3A3A3]">
                Articula looks at how you've been solving, explaining, and
                improving. Its adaptive practice system uses that history to
                decide what you should work on next.
              </p>
            </motion.div>

            <div className="mt-16 grid gap-5 md:grid-cols-4">
              {[
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
              ].map((item, index) => (
                <motion.div
                  key={item.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  className="relative rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#1b1b1b]"
                >
                  <span className="text-xs font-medium text-black/35 dark:text-white/35">
                    {item.number}
                  </span>

                  <h3 className="mt-6 font-display text-2xl">
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
              className="mt-8 grid overflow-hidden rounded-2xl border border-black/10 bg-white dark:border-white/10 dark:bg-[#1b1b1b] md:grid-cols-[1fr_auto]"
            >
              <div className="p-7 md:p-8">
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-black/40 dark:text-white/40">
                  Example recommendation
                </p>

                <h3 className="mt-3 font-display text-2xl">
                  Focus on complexity articulation.
                </h3>

                <p className="mt-3 max-w-[650px] text-sm leading-6 text-black/55 dark:text-white/55">
                  You've been consistently solving problems correctly. Your
                  next practice can focus on making the reasoning behind your
                  complexity analysis more precise.
                </p>
              </div>

              <div className="flex items-center border-t border-black/10 p-7 md:border-l md:border-t-0 md:p-8 dark:border-white/10">
                <motion.button
                  onClick={() => navigate("/interactive")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white dark:bg-white dark:text-black"
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
        <section className="px-6 py-24 md:px-16">
          <div className="mx-auto max-w-[1100px]">
            <div className="text-center">
              <p className="mb-4 font-sans text-sm font-medium uppercase tracking-[0.18em] text-black/50 dark:text-white/50">
                Two ways to practice
              </p>

              <h2 className="font-display text-4xl tracking-[-0.03em] md:text-5xl">
                You choose.
                <span className="text-black/35 dark:text-white/35">
                  {" "}
                  Or Articula does.
                </span>
              </h2>
            </div>

            <div className="mt-14 grid overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 md:grid-cols-2">
              <motion.div
                whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                className="border-b border-black/10 p-8 md:border-b-0 md:border-r md:p-10 dark:border-white/10 dark:hover:bg-white/[0.02]"
              >
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-black/40 dark:text-white/40">
                  Practice
                </span>

                <h3 className="mt-5 font-display text-3xl">
                  You choose the problem.
                </h3>

                <p className="mt-4 text-sm leading-6 text-black/55 dark:text-white/55">
                  Pick a topic, difficulty, and problem. Solve it at your own
                  pace and use Articula to evaluate how you reason and
                  articulate.
                </p>

                <button
                  onClick={() => navigate("/problems")}
                  className="mt-7 text-sm font-medium underline decoration-black/20 underline-offset-4 transition-colors hover:decoration-black dark:decoration-white/20 dark:hover:decoration-white"
                >
                  Explore problems →
                </button>
              </motion.div>

              <motion.div
                whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                className="p-8 md:p-10 dark:hover:bg-white/[0.02]"
              >
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-black/40 dark:text-white/40">
                  Interactive
                </span>

                <h3 className="mt-5 font-display text-3xl">
                  Articula chooses what's next.
                </h3>

                <p className="mt-4 text-sm leading-6 text-black/55 dark:text-white/55">
                  Your previous performance becomes context. Articula adapts
                  the next challenge around what you need to improve.
                </p>

                <button
                  onClick={() => navigate("/interactive")}
                  className="mt-7 text-sm font-medium underline decoration-black/20 underline-offset-4 transition-colors hover:decoration-black dark:decoration-white/20 dark:hover:decoration-white"
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
        <section className="border-t border-black/[0.08] px-6 py-24 dark:border-white/[0.08] md:px-16">
          <div className="mx-auto max-w-[1350px]">
            <div className="grid gap-12 md:grid-cols-[0.7fr_1.3fr] md:items-center">
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6 }}
              >
                <p className="mb-4 font-sans text-sm font-medium uppercase tracking-[0.18em] text-black/50 dark:text-white/50">
                  Your progress
                </p>

                <h2 className="font-display text-4xl leading-tight tracking-[-0.03em] md:text-5xl">
                  See your
                  <br />
                  <span className="text-black/35 dark:text-white/35">
                    progress compound.
                  </span>
                </h2>

                <p className="mt-6 max-w-[430px] text-sm leading-6 text-black/55 dark:text-white/55">
                  Every problem, articulation, execution result, and evaluation
                  contributes to a clearer picture of how you are improving.
                </p>

                <button
                  onClick={() => navigate("/dashboard")}
                  className="mt-7 text-sm font-medium underline decoration-black/20 underline-offset-4 transition-colors hover:decoration-black dark:decoration-white/20 dark:hover:decoration-white"
                >
                  View your dashboard →
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6 }}
                className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-[#1b1b1b] dark:shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
              >
                <div className="flex items-center justify-between border-b border-black/10 px-6 py-5 dark:border-white/10">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-black/40 dark:text-white/40">
                      Dashboard
                    </p>

                    <h3 className="mt-1 font-display text-xl">
                      Your progress.
                    </h3>
                  </div>

                  <span className="text-[10px] uppercase tracking-[0.15em] text-black/35 dark:text-white/35">
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
                      className={`p-5 ${
                        index < 3
                          ? "border-r border-black/10 dark:border-white/10"
                          : ""
                      }`}
                    >
                      <p className="text-[10px] uppercase tracking-[0.14em] text-black/40 dark:text-white/40">
                        {label}
                      </p>

                      <p className="mt-2 font-display text-2xl">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-[1.15fr_0.85fr]">
                  {/* Chart */}
                  <div className="border-b border-black/10 p-6 md:border-b-0 md:border-r dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-black/40 dark:text-white/40">
                        Articulation over time
                      </p>

                      <span className="text-[10px] text-black/35 dark:text-white/35">
                        Recent sessions
                      </span>
                    </div>

                    <div className="relative mt-7 h-[145px]">
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

                      <div className="absolute bottom-[-20px] left-0 right-0 flex justify-between text-[9px] text-black/30 dark:text-white/30">
                        <span>1</span>
                        <span>4</span>
                        <span>8</span>
                        <span>12</span>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="p-6">
                    <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-black/40 dark:text-white/40">
                      Skill breakdown
                    </p>

                    <div className="mt-6 space-y-4">
                      {dashboardSkills.map(([label, score, width]) => (
                        <div key={label}>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-black/55 dark:text-white/55">
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

                <div className="border-t border-black/10 px-6 py-4 dark:border-white/10">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-black/35 dark:text-white/35">
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