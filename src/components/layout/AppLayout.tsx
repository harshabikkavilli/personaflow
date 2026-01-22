import { Github, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';

const navItems = [
  { name: 'Editor', href: '/editor', isInternal: true },
  { name: 'Examples', href: '/examples', isInternal: true },
];

export function AppLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <div className="flex flex-col min-h-screen bg-[var(--pf-bg-primary)]">
        {/* Fixed Header */}
        <header className="fixed top-0 z-[60] w-full border-b border-white/5 bg-black/40 backdrop-blur-xl">
          <div className="mx-auto flex h-20 items-center justify-between px-6 lg:px-8">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img
                src={logo}
                alt="PersonaFlow"
                className="h-10 w-10 object-contain"
              />
              <h1 
                className="text-xl font-bold tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, #60A5FA, #34D399, #FDE047, #F472B6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                PersonaFlow
              </h1>
            </Link>

            {/* Right side: Navigation, GitHub and Menu */}
            <div className="flex items-center gap-6">
              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-8">
                {navItems.map((item) => {
                  const isActive = item.isInternal && location.pathname === item.href;

                  return item.isInternal ? (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`text-sm font-medium transition-colors ${
                        isActive
                          ? 'gradient-primary-text'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <a
                      key={item.name}
                      className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                      href={item.href}
                    >
                      {item.name}
                    </a>
                  );
                })}
              </nav>

              <a
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all hover:border-white/20"
                href="https://github.com/harshabikkavilli/personaflow"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
              >
                <Github className="w-5 h-5" />
              </a>

              {/* Hamburger Button */}
              <button
                onClick={toggleMenu}
                className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white transition-all hover:bg-white/10"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content - Add padding top for fixed header */}
        <main className="flex-1 flex flex-col pt-20">
          <Outlet />
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {/* Background Dimmer */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Menu Panel - Slides down from under header */}
      <div
        className={`fixed top-20 left-0 w-full z-50 md:hidden transition-all duration-300 ease-in-out transform ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full invisible'
        }`}
      >
        <div className="bg-[var(--pf-bg-primary)] border-b border-white/10 px-6 py-8 shadow-2xl relative">
          {/* Grid pattern match */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent_70%)] pointer-events-none"></div>

          <nav className="relative flex flex-col gap-5">
            {navItems.map((item) => {
              const isActive = item.isInternal && location.pathname === item.href;

              return item.isInternal ? (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-xl font-medium flex items-center justify-between group py-2 ${
                    isActive ? 'gradient-primary-text' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <span>{item.name}</span>
                  <svg
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? 'gradient-primary-text'
                        : 'text-gray-600 group-hover:gradient-primary-text'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-xl font-medium text-gray-300 hover:text-white flex items-center justify-between group py-2"
                >
                  <span>{item.name}</span>
                  <svg
                    className="w-4 h-4 text-gray-600 group-hover:gradient-primary-text transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              );
            })}
            <div className="pt-6 mt-4 border-t border-white/5">
              <a
                className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-base font-medium text-white hover:bg-white/10 transition-all hover:border-white/20"
                href="https://github.com/harshabikkavilli/personaflow"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                aria-label="GitHub repository"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
