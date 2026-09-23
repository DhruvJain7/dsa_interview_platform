import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home({ onNavigate }) {
  return (
    <div className="min-h-screen bg-[#f3f3f1] p-5 dark:bg-[#181818]">
      <div className="relative min-h-[calc(100vh-2.5rem)] overflow-hidden bg-white dark:bg-[#222222]">

        {/* Navbar */}
        <Navbar
          activePage="home"
          onNavigate={onNavigate}
        />

        {/* Hero */}
        <main className="relative z-10 flex flex-col items-center px-6 pt-12">
          <section className="text-center">

            {/* Product descriptor */}
            <p className="mb-6 font-sans text-sm font-medium uppercase tracking-[0.18em] text-black/50 dark:text-white/50">
              AI-powered DSA interview practice
            </p>

            {/* Main heading */}
            <h1 className="font-display text-[clamp(4rem,8vw,7rem)] leading-[0.95] tracking-[-0.045em] text-black dark:text-[#F5F5F5]">
              Articulate Everything.
            </h1>

            {/* Tagline */}
            <p className="mx-auto mt-8 max-w-[600px] font-sans text-lg font-medium tracking-tight text-black/70 dark:text-[#A3A3A3] md:text-xl">
              Don't just solve problems. Articulate your solutions.
            </p>

            {/* CTA */}
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                onClick={() => onNavigate("problems")}
                className="group rounded-full bg-black px-7 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:bg-[#292929] dark:bg-[#F5F5F5] dark:text-[#181818] dark:hover:bg-white"
              >
                Start Practicing
                <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </button>

              <button
                onClick={() => onNavigate("problems")}
                className="rounded-full border border-black/20 px-7 py-3.5 text-sm font-medium text-black transition-colors hover:bg-black/5 dark:border-white/20 dark:text-[#F5F5F5] dark:hover:bg-white/10"
              >
                Explore Problems
              </button>
            </div>

          </section>
        </main>

        {/* How Articula Works */}
        <section className="relative z-10 px-6 pb-16 pt-24 md:px-16">
          <div className="mx-auto max-w-[1350px]">

            {/* Section heading */}
            <div className="max-w-[600px]">
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
            </div>

            {/* Four steps */}
            <div className="mt-20 grid grid-cols-1 border-y border-black/15 dark:border-white/15 md:grid-cols-4">

              {/* Think */}
              <div className="border-b border-black/15 py-8 md:border-b-0 md:border-r md:pr-8 dark:border-white/15">
                <span className="font-sans text-xs font-medium text-black/40 dark:text-white/40">
                  01
                </span>

                <h3 className="mt-8 font-display text-3xl text-black dark:text-[#F5F5F5]">
                  Think
                </h3>

                <p className="mt-4 font-sans text-sm leading-6 text-black/60 dark:text-[#A3A3A3]">
                  Understand the problem, identify the pattern, and build your approach.
                </p>
              </div>

              {/* Articulate */}
              <div className="border-b border-black/15 py-8 md:border-b-0 md:border-r md:px-8 dark:border-white/15">
                <span className="font-sans text-xs font-medium text-black/40 dark:text-white/40">
                  02
                </span>

                <h3 className="mt-8 font-display text-3xl text-black dark:text-[#F5F5F5]">
                  Articulate
                </h3>

                <p className="mt-4 font-sans text-sm leading-6 text-black/60 dark:text-[#A3A3A3]">
                  Explain your reasoning, edge cases, and complexity before you code.
                </p>
              </div>

              {/* Code */}
              <div className="border-b border-black/15 py-8 md:border-b-0 md:border-r md:px-8 dark:border-white/15">
                <span className="font-sans text-xs font-medium text-black/40 dark:text-white/40">
                  03
                </span>

                <h3 className="mt-8 font-display text-3xl text-black dark:text-[#F5F5F5]">
                  Code
                </h3>

                <p className="mt-4 font-sans text-sm leading-6 text-black/60 dark:text-[#A3A3A3]">
                  Turn your reasoning into a working solution and test it against real cases.
                </p>
              </div>

              {/* Improve */}
              <div className="py-8 md:pl-8">
                <span className="font-sans text-xs font-medium text-black/40 dark:text-white/40">
                  04
                </span>

                <h3 className="mt-8 font-display text-3xl text-black dark:text-[#F5F5F5]">
                  Improve
                </h3>

                <p className="mt-4 font-sans text-sm leading-6 text-black/60 dark:text-[#A3A3A3]">
                  Get feedback on your thinking and learn how to communicate better.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer onNavigate={onNavigate} />

      </div>
    </div>
  );
}

export default Home;