function Footer({ onNavigate }) {
  return (
    <footer className="border-t border-black/10 px-6 py-10 dark:border-white/10 md:px-16">
      <div className="mx-auto max-w-[1350px]">
        {/* Top row */}
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <button
            onClick={() => onNavigate("home")}
            className="text-[28px] tracking-tight text-black dark:text-[#F5F5F5]"
          >
            Articula
          </button>

          <p className="text-sm text-black/50 dark:text-white/50">
            Practice the way you interview.
          </p>

          <div className="flex items-center gap-6 text-sm">
            <button
              onClick={() => onNavigate("problems")}
              className="transition-opacity hover:opacity-50"
            >
              Practice
            </button>

            <button
              onClick={() => onNavigate("dashboard")}
              className="transition-opacity hover:opacity-50"
            >
              Dashboard
            </button>

            <button
              onClick={() => onNavigate("interactive")}
              className="transition-opacity hover:opacity-50"
            >
              Interactive
            </button>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-10 border-t border-black/10 pt-5 text-xs text-black/40 dark:border-white/10 dark:text-white/40">
          <p>© 2026 Articula</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;