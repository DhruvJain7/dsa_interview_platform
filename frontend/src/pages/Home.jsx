import articulaFlow from "../assets/articula-flow.png";
import Navbar from "../components/Navbar";
function Home({ onNavigate }) {
  return (
    <div className="min-h-screen bg-[#f3f3f1] p-5">
      <div className="relative min-h-[calc(100vh-2.5rem)] overflow-hidden bg-white">

        {/* Navbar */}
        <Navbar
          activePage="home"
          onNavigate={onNavigate}
        />

        {/* Hero */}
        <main className="relative z-10 flex min-h-[calc(100vh-170px)] items-center justify-center px-6">
          <section className="-mt-8 text-center">

            <h1 className="font-display text-[clamp(4rem,8vw,7rem)] leading-[0.95] tracking-[-0.045em]">
              Articulate Everything.
            </h1>

            <p className="mt-9 font-sans text-lg font-medium tracking-tight md:text-xl">
              Don't just solve problems. Articulate your solutions.
            </p>

          </section>
        </main>

        {/* Bottom visual */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 w-[90%] max-w-[1250px] -translate-x-1/2 translate-y-[8%]">
          <img
            src={articulaFlow}
            alt=""
            className="w-full opacity-60"
          />
        </div>

      </div>
    </div>
  );
}

export default Home;
