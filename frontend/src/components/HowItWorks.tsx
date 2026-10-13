import { UploadCloud, Clock, ShieldCheck, QrCode } from "lucide-react";

interface StepProps {
  step: string;
  icon: React.ReactNode;
  accent: string;
  borderHover: string;
  bgIcon: string;
  title: string;
  description: string;
  detail: string;
}

const steps: StepProps[] = [
  {
    step: "01",
    icon: <UploadCloud className="h-6 w-6 text-violet-400" />,
    accent: "text-violet-400",
    borderHover: "hover:border-violet-500/50",
    bgIcon: "bg-violet-500/10 border-violet-500/30",
    title: "Select & Bundle",
    description: "Choose single or multiple files up to 50MB total.",
    detail: "Bundled directly in your browser using JSZip with zero external dependencies.",
  },
  {
    step: "02",
    icon: <Clock className="h-6 w-6 text-amber-400" />,
    accent: "text-amber-400",
    borderHover: "hover:border-amber-500/50",
    bgIcon: "bg-amber-500/10 border-amber-500/30",
    title: "Define Lifespan",
    description: "Set expiration times and strict download limits.",
    detail: "Choose 1 min to 24 hrs, or burn-after-1-download to prevent redistribution.",
  },
  {
    step: "03",
    icon: <ShieldCheck className="h-6 w-6 text-emerald-400" />,
    accent: "text-emerald-400",
    borderHover: "hover:border-emerald-500/50",
    bgIcon: "bg-emerald-500/10 border-emerald-500/30",
    title: "Client-Side Encrypt",
    description: "Secured with military-grade AES-256-GCM encryption.",
    detail: "The encryption key is generated locally in memory and never touches our server.",
  },
  {
    step: "04",
    icon: <QrCode className="h-6 w-6 text-cyan-400" />,
    accent: "text-cyan-400",
    borderHover: "hover:border-cyan-500/50",
    bgIcon: "bg-cyan-500/10 border-cyan-500/30",
    title: "Share Link or QR",
    description: "Deliver via short link or scan with any mobile camera.",
    detail: "The decryption key is embedded in the link fragment for seamless one-click recipient access.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="howItWorks" className="relative py-24 sm:py-32 scroll-mt-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
            <span>EFFORTLESS WORKFLOW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            How CloudShare{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto">
            Zero friction, uncompromising privacy. Transfer confidential files in four simple steps without ever creating an account.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ step, icon, accent, borderHover, bgIcon, title, description, detail }) => (
            <div
              key={step}
              className={`group relative rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-xl p-6 transition-all duration-300 hover:-translate-y-1.5 ${borderHover} hover:shadow-2xl hover:shadow-black/60 flex flex-col justify-between`}
            >
              <div>
                {/* Step number and icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className={`h-12 w-12 rounded-xl border flex items-center justify-center group-hover:scale-110 transition-all duration-300 ${bgIcon}`}>
                    {icon}
                  </div>
                  <span className={`text-3xl font-black text-zinc-800 font-mono transition-colors group-hover:${accent}`}>
                    {step}
                  </span>
                </div>

                <h3 className={`text-lg font-semibold text-white mb-2 transition-colors group-hover:${accent}`}>
                  {title}
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed mb-3">
                  {description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 text-xs text-zinc-400">
                {detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
