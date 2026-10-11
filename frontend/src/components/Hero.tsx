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
      {/* Background ambient glow spheres */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-purple-600/20 via-fuchsia-600/15 to-pink-600/20 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-indigo-600/15 blur-[110px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 max-w-5xl flex flex-col items-center justify-center text-center">
        {/* Top Tagline Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500"></span>
            </span>
            <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              <span>Zero-Knowledge • Client-Side AES-256 • Self-Destructing</span>
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="space-y-6 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Share Files Privately.{" "}
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Expire Automatically.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-300/90 leading-relaxed font-normal max-w-2xl mx-auto">
            Encrypt your files directly in your browser before upload. Share temporary, self-destructing links and QR codes with zero registration, no cookies, and no tracking.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/upload"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <UploadCloud className="h-5 w-5" />
              <span>Start Uploading</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>

            <a
              href="#howItWorks"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all duration-200"
            >
              <span>See How It Works</span>
            </a>
          </div>
        </div>

        {/* Centerpiece Visual: Zero-Knowledge Security Pipeline */}
        <div className="mt-10 w-full max-w-4xl relative">
          {/* Card Border Glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 via-fuchsia-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-70 pointer-events-none -z-10" />

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-5 sm:p-7 shadow-2xl text-left">
            {/* Pipeline Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-mono font-medium text-slate-300">
                  Zero-Knowledge Cryptographic Pipeline
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-300">
                <ShieldCheck className="h-3 w-3" />
                <span>WebCrypto AES-GCM 256 Active</span>
              </div>
            </div>

            {/* 3 Interactive Pipeline Stages */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
              {/* Stage 1 */}
              <div className="group relative rounded-xl bg-slate-950/60 border border-white/10 p-4 hover:border-purple-500/40 hover:bg-white/[0.02] transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Key className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    STAGE 01
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  Client Encryption
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Files encrypted directly inside your browser. Decryption key is attached only to the URL hash fragment.
                </p>
              </div>

              {/* Stage 2 */}
              <div className="group relative rounded-xl bg-slate-950/60 border border-white/10 p-4 hover:border-fuchsia-500/40 hover:bg-white/[0.02] transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-lg bg-fuchsia-500/15 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400">
                    <EyeOff className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20">
                    STAGE 02
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  Zero Server Access
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  AWS S3 receives raw encrypted ciphertext blobs with zero knowledge of keys, passwords, or file contents.
                </p>
              </div>

              {/* Stage 3 */}
              <div className="group relative rounded-xl bg-slate-950/60 border border-white/10 p-4 hover:border-pink-500/40 hover:bg-white/[0.02] transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-lg bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400">
                    <Flame className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-300 border border-pink-500/20">
                    STAGE 03
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  Ephemeral Destruction
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Auto-purges after 1 download or timer expiry. Cloud storage records are expunged automatically.
                </p>
              </div>
            </div>

            {/* Pipeline Footer Specs */}
            <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  <span>No Account Required</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Server className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Zero Server Logs</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="h-3.5 w-3.5 text-purple-400" />
                  <span>Up to 24-Hour Expiration</span>
                </span>
              </div>

              <Link
                to="/upload"
                className="inline-flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors group"
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