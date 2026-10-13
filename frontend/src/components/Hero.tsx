import { Link } from "react-router-dom";
import {
  UploadCloud,
  ShieldCheck,
  ArrowRight,
  Clock,
  Sparkles,
  Flame,
  Key,
  EyeOff,
  Server,
  Zap,
} from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-12 md:py-16">
      {/* Background ambient lighting with rich chromatic spread */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[400px] bg-indigo-600/15 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[380px] h-[380px] bg-emerald-500/[0.05] blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[380px] h-[380px] bg-cyan-500/[0.05] blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 max-w-5xl flex flex-col items-center justify-center text-center">
        {/* Top Tagline Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-white/10 backdrop-blur-md shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Client-Side AES-256 • Self-Destructing</span>
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="space-y-6 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Share Files Privately.{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              Expire Automatically.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-zinc-300/90 leading-relaxed font-normal max-w-2xl mx-auto">
            Encrypt your files directly in your browser before upload. Share temporary, self-destructing links and QR codes with zero registration, no cookies, and no tracking.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/upload"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 border border-indigo-400/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_4px_20px_rgba(79,70,229,0.35)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_6px_24px_rgba(79,70,229,0.5)] active:scale-[0.99] transition-all duration-150"
            >
              <UploadCloud className="h-5 w-5" />
              <span>Start Uploading</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>

            <a
              href="#howItWorks"
              onClick={(e) => {
                e.preventDefault();
                const elem = document.getElementById("howItWorks");
                if (elem) elem.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-zinc-200 hover:text-white bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-700/80 hover:border-zinc-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] active:scale-[0.99] transition-all duration-150"
            >
              <span>See How It Works</span>
            </a>
          </div>
        </div>

        {/* Centerpiece Visual: Cryptographic Security Pipeline */}
        <div className="mt-10 w-full max-w-4xl relative">
          <div className="rounded-2xl border border-white/10 bg-zinc-950/90 backdrop-blur-2xl p-5 sm:p-7 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_-20px_rgba(99,102,241,0.2)] text-left relative overflow-hidden">
            {/* Top specular highlight line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

            {/* Pipeline Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-mono font-medium text-zinc-300">
                  Cryptographic Security Pipeline
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-mono text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                <ShieldCheck className="h-3 w-3" />
                <span>WebCrypto AES-GCM 256 Active</span>
              </div>
            </div>

            {/* 3 Interactive Pipeline Stages */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
              {/* Stage 1: Electric Violet */}
              <div className="group relative rounded-xl bg-zinc-900/60 border border-violet-500/30 p-4 hover:border-violet-500/60 hover:bg-violet-950/20 transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-lg bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                    <Key className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-violet-500/15 text-violet-300 border border-violet-500/30">
                    STAGE 01
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-violet-200 transition-colors">
                  Client Encryption
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Files encrypted directly inside your browser. Decryption key is attached only to the URL hash fragment.
                </p>
              </div>

              {/* Stage 2: Vivid Cyan */}
              <div className="group relative rounded-xl bg-zinc-900/60 border border-cyan-500/30 p-4 hover:border-cyan-500/60 hover:bg-cyan-950/20 transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                    <EyeOff className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    STAGE 02
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-cyan-200 transition-colors">
                  Zero Server Access
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Storage receives raw encrypted ciphertext blobs without access to keys, passwords, or file contents.
                </p>
              </div>

              {/* Stage 3: Warm Amber */}
              <div className="group relative rounded-xl bg-zinc-900/60 border border-amber-500/30 p-4 hover:border-amber-500/60 hover:bg-amber-950/20 transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    <Flame className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    STAGE 03
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-amber-200 transition-colors">
                  Ephemeral Destruction
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Auto-purges after 1 download or timer expiry. Cloud storage records are expunged automatically.
                </p>
              </div>
            </div>

            {/* Pipeline Footer Specs */}
            <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-400">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px]">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  <span>No Account Required</span>
                </span>
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Server className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Zero Server Logs</span>
                </span>
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Clock className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Up to 24-Hour Expiration</span>
                </span>
              </div>

              <Link
                to="/upload"
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors group"
              >
                <span>Upload encrypted file</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;