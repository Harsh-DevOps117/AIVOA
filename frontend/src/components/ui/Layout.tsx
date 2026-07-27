import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Layout: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-canvas flex flex-col relative">
      {/* Top Nav */}
      <header className="h-16 border-b border-brand-hairline bg-brand-canvas flex items-center px-4 md:px-8 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-ink" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              </svg>
              <span className="font-display text-xl font-medium tracking-tight">AIVIO Copilot</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-brand-ink' : 'text-brand-muted hover:text-brand-ink'}`}
              >
                Log Complaint
              </Link>
              <Link 
                to="/dashboard" 
                className={`text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-brand-ink' : 'text-brand-muted hover:text-brand-ink'}`}
              >
                Dashboard
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-brand-ink bg-brand-surface-card border border-brand-hairline px-4 py-1.5 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#5db872] animate-pulse"></span>
              You are using AIVIO Copilot
            </div>
            
            {/* Hamburger Button */}
            <button 
              className="md:hidden p-2 text-brand-ink focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-canvas border-b border-brand-hairline px-6 py-6 space-y-6 absolute w-full z-40 top-16 shadow-xl">
          <nav className="flex flex-col gap-5">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className={`text-lg font-medium transition-colors ${location.pathname === '/' ? 'text-brand-ink' : 'text-brand-muted'}`}
            >
              Log Complaint
            </Link>
            <Link 
              to="/dashboard" 
              onClick={() => setMobileMenuOpen(false)}
              className={`text-lg font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-brand-ink' : 'text-brand-muted'}`}
            >
              Dashboard
            </Link>
          </nav>
          <div className="pt-6 border-t border-brand-hairline">
            <div className="flex items-center gap-2 text-sm font-medium text-brand-ink bg-brand-surface-card border border-brand-hairline px-4 py-2 rounded-full shadow-sm w-max">
              <span className="w-2 h-2 rounded-full bg-[#5db872] animate-pulse"></span>
              AIVIO Copilot Active
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-[1200px] mx-auto w-full py-16 px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>
      
      {/* Footer */}
      <footer className="bg-brand-surface-dark text-brand-on-dark pt-16 pb-8 px-8 mt-auto">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-6 text-brand-on-primary">
               <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              </svg>
              <span className="font-display text-lg tracking-tight">AIVIO Copilot</span>
            </div>
            <p className="text-sm text-brand-muted">Building the next generation of intelligent QMS software.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
