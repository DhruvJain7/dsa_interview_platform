import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Interactive() {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#222222] dark:text-white">
      <Navbar />

      <main className="mx-auto max-w-[1000px] px-8 pb-20 pt-24">
        <section className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
            Interactive
          </p>

          <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight">
            Adaptive practice.
          </h1>

          <p className="mt-4 text-sm leading-6 text-gray-500 dark:text-gray-400">
            Articula adapts your practice based on how you
            solve problems, explain your reasoning, and
            articulate your approach.
          </p>

          <button
            className="mt-8 rounded-md bg-black px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-black"
          >
            Start interactive practice
          </button>
        </section>
      </main>

      <Footer variant="minimal" />
    </div>
  );
}

export default Interactive;
