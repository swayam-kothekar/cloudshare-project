import { ShieldCheck, ArrowUpRight, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer id="footer" className="relative border-t border-white/10 bg-background/80 backdrop-blur-xl">
      {/* Subtle top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      <div className="container mx-auto px-6 py-14 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand section */}
          <div className="md:col-span-5 space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 font-bold text-2xl tracking-tight text-white group"
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-pink-500 p-2 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform duration-200">
                <Lock className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                CloudShare
              </span>
            </Link>

            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Instant, end-to-end encrypted temporary file transfers. Your files are encrypted in your browser with AES-256-GCM and automatically purged on expiration.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
              <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
              <span>Zero-knowledge client-side encryption</span>
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
                  className="text-foreground/80 hover:text-white transition-colors flex items-center gap-1.5 group"
                >
                  <span>Upload Files</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </li>
              <li>
                <a
                  href="/#howItWorks"
                  className="text-foreground/80 hover:text-white transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="/#features"
                  className="text-foreground/80 hover:text-white transition-colors"
                >
                  Key Features
                </a>
              </li>
              <li>
                <a
                  href="/#faq"
                  className="text-foreground/80 hover:text-white transition-colors"
                >
                  Security & FAQ
                </a>
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
            <div className="flex items-center gap-2 text-emerald-400/90 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Ephemeral storage active</span>
            </div>

            <a
              href="https://github.com"
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

