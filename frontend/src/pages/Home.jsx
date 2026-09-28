import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home({ onNavigate }) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#222222]">
      <div className="relative min-h-screen bg-white dark:bg-[#222222]">
          {/* =================================================
              NAVBAR
          ================================================== */}
          <Navbar
            activePage="home"
            onNavigate={onNavigate}
          />
        {/* =====================================================
            HERO
        ====================================================== */}
        <main className="relative z-10 flex h-[760px] shrink-0 flex-col overflow-hidden">

         

          {/* =================================================
              HERO CONTENT
          ================================================== */}
      <section className="relative z-20 flex flex-col items-center px-6 pt-30 text-center">

            {/* Product Descriptor */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 font-sans text-sm font-medium uppercase tracking-[0.18em] text-black/50 dark:text-white/50"
            >
              AI-powered DSA interview practice
            </motion.p>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-[clamp(4rem,8vw,7rem)] leading-[0.95] tracking-[-0.045em] text-black dark:text-[#F5F5F5]"
            >
              Articulate Everything.
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-8 max-w-[600px] font-sans text-lg font-medium tracking-tight text-black/70 dark:text-[#A3A3A3] md:text-xl"
            >
              Don't just solve problems. Articulate your solutions.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex items-center justify-center gap-4"
            >
              {/* Start Practicing */}
              <motion.button
                onClick={() => onNavigate("problems")}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group rounded-full bg-black px-7 py-3.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#292929] dark:bg-[#F5F5F5] dark:text-[#181818] dark:hover:bg-white"
              >
                Start Practicing

                <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </motion.button>

              {/* Explore Problems */}
              <motion.button
                onClick={() => onNavigate("problems")}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full border border-black/20 px-7 py-3.5 text-sm font-medium text-black transition-colors duration-200 hover:bg-black/5 dark:border-white/20 dark:text-[#F5F5F5] dark:hover:bg-white/10"
              >
                Explore Problems
              </motion.button>
            </motion.div>
          </section>

          {/* =================================================
              HERO ORBIT
          ================================================== */}
          <div className="pointer-events-none absolute left-1/2 top-[26rem] hidden h-[330px] w-[680px] -translate-x-1/2 md:block">

            {/* Outer Orbit */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 45,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute left-1/2 top-1/2 h-[280px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-black/[0.07] dark:border-white/[0.07]"
            />

            {/* Inner Orbit */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute left-1/2 top-1/2 h-[190px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-black/[0.05] dark:border-white/[0.05]"
            />

            {/* Center */}
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-[#222222]/80"
            >
              <motion.div
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="h-2 w-2 rounded-full bg-black dark:bg-white"
              />
            </motion.div>

            {/* THINK */}
            <div className="absolute left-[10%] top-[40%] rounded-full border border-black/10 bg-white/80 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-black/40 backdrop-blur-sm dark:border-white/10 dark:bg-[#222222]/80 dark:text-white/40">
              Think
            </div>

            {/* ARTICULATE */}
            <div className="absolute right-[7%] top-[40%] rounded-full border border-black/10 bg-white/80 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-black/40 backdrop-blur-sm dark:border-white/10 dark:bg-[#222222]/80 dark:text-white/40">
              Articulate
            </div>

            {/* CODE */}
            <div className="absolute bottom-[2%] left-[28%] rounded-full border border-black/10 bg-white/80 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-black/40 backdrop-blur-sm dark:border-white/10 dark:bg-[#222222]/80 dark:text-white/40">
              Code
            </div>

            {/* IMPROVE */}
            <div className="absolute bottom-[2%] right-[28%] rounded-full border border-black/10 bg-white/80 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-black/40 backdrop-blur-sm dark:border-white/10 dark:bg-[#222222]/80 dark:text-white/40">
              Improve
            </div>
          </div>
        </main>

        {/* =====================================================
            HOW ARTICULA WORKS
        ====================================================== */}
        <section className="relative z-10 px-6 pb-16 pt-24 md:px-16">
          <div className="mx-auto max-w-[1350px]">

            {/* Section Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="max-w-[600px]"
            >
              <p className="mb-4 font-sans text-sm font-medium uppercase tracking-[0.18em] text-black/50 dark:text-white/50">
                The Articula Method
              </p>

              <h2 className="font-display text-4xl leading-tight tracking-[-0.03em] text-black dark:text-[#F5F5F5] md:text-5xl">
                Don't just write the answer.
                <br />

                <span className="text-black/40 dark:text-white/40">
                  Explain how you got there.
                </span>
              </h2>
            </motion.div>

            {/* Four Steps */}
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
              className="mt-20 grid grid-cols-1 border-y border-black/15 dark:border-white/15 md:grid-cols-4"
            >
              {[
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
              ].map((step, index) => (
                <motion.div
                  key={step.number}
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 25,
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

                  <h3 className="mt-8 font-display text-3xl text-black dark:text-[#F5F5F5]">
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

        {/* Footer */}
        <Footer onNavigate={onNavigate} />
      </div>
    </div>
  );
}

export default Home;