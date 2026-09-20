function Navbar({ activePage, onNavigate }) {
  const navItems = [
    { label: "Dashboard", page: "dashboard" },
    { label: "Practice", page: "problems" },
    { label: "Interactive", page: "interactive" },
  ];

  return (
    <header className="relative z-10 px-10 pt-10 md:px-16">
      <nav className="mx-auto flex max-w-[1350px] items-center justify-between">

        {/* Logo */}
        <button
          onClick={() => onNavigate("home")}
          className="text-[28px] tracking-tight"
        >
          Articula
        </button>

        {/* Center Navigation */}
        <div className="absolute left-1/2 top-10 hidden -translate-x-1/2 items-center rounded-full border border-black/50 bg-[#fffafa] px-2 py-1.5 md:flex">
          {navItems.map((item) => {
            const isActive = activePage === item.page;

            return (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`rounded-full px-7 py-2 text-[15px] transition-colors ${
                  isActive
                    ? "bg-black text-white"
                    : "hover:bg-black hover:text-white"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">

          {/* GitHub */}
          <button
            aria-label="GitHub"
            className="transition-opacity hover:opacity-50"
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
            className="transition-opacity hover:opacity-50"
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
      </nav>
    </header>
  );
}

export default Navbar;
