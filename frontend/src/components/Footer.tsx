import { ShieldCheck, ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { CloudLogo } from "./Icons";

export const Footer = () => {
  const location = useLocation();

  const handleSectionClick = (id: string) => {
    if (location.pathname === "/") {
      const elem = document.getElementById(id);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer id="footer" className="relative border-t border-white/[0.08] bg-zinc-950/90 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-14 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand section */}
          <div className="md:col-span-5 space-y-4">
            <Link
              to="/"
              onClick={() => {
                if (location.pathname === "/") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="inline-flex items-center gap-2.5 font-bold text-2xl tracking-tight text-white group"
            >
              <CloudLogo className="h-9 w-9 drop-shadow-[0_4px_16px_rgba(59,130,246,0.35)] group-hover:scale-105 transition-transform" />
              <span className="font-bold text-2xl tracking-tight text-white flex items-center">
                Cloud<span className="text-indigo-400">Share</span>
              </span>
            </Link>

            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              Instant, end-to-end encrypted temporary file transfers. Your files are encrypted in your browser with AES-256-GCM and automatically purged on expiration.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-white/10 text-xs text-zinc-300">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
              <span>Client-side AES-256 encryption</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/upload"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="text-foreground/80 hover:text-white transition-colors flex items-center gap-1.5 group"
                >
                  <span>Upload Files</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </li>
              <li>
                <Link
                  to="/#howItWorks"
                  onClick={() => handleSectionClick("howItWorks")}
                  className="text-foreground/80 hover:text-white transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/#features"
                  onClick={() => handleSectionClick("features")}
                  className="text-foreground/80 hover:text-white transition-colors"
                >
                  Key Features
                </Link>
              </li>
              <li>
                <Link
                  to="/#faq"
                  onClick={() => handleSectionClick("faq")}
                  className="text-foreground/80 hover:text-white transition-colors"
                >
                  Security & FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & Guarantees */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
              Privacy & Security
            </h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Client-Side AES-256-GCM encryption</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Auto-expiring temporary storage (up to 24h)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Download limit burn-after-reading</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>No sign-up, tracking, or logs</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} CloudShare. Free, private, and secure file sharing.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/swayam-kothekar/cloudshare-project"
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-white transition-colors flex items-center gap-1.5"
              aria-label="GitHub Repository"
            >
              <svg
                className="h-4 w-4 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              <span>Open Source</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

