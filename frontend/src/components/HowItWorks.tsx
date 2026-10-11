import { UploadCloud, Clock, ShieldCheck, QrCode } from "lucide-react";

interface StepProps {
  step: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  detail: string;
}

const steps: StepProps[] = [
  {
    step: "01",
    icon: <UploadCloud className="h-6 w-6 text-purple-400" />,
    title: "Select & Bundle",
    description: "Choose single or multiple files up to 50MB total.",
    detail: "Bundled directly in your browser using JSZip with zero external dependencies.",
  },
  {
    step: "02",
    icon: <Clock className="h-6 w-6 text-fuchsia-400" />,
    title: "Define Lifespan",
    description: "Set expiration times and strict download limits.",
    detail: "Choose 1 min to 24 hrs, or burn-after-1-download to prevent redistribution.",
  },
  {
    step: "03",
    icon: <ShieldCheck className="h-6 w-6 text-pink-400" />,
    title: "Client-Side Encrypt",
    description: "Secured with military-grade AES-256-GCM encryption.",
    detail: "The encryption key is generated locally in memory and never touches our server.",
  },
  {
    step: "04",
    icon: <QrCode className="h-6 w-6 text-indigo-400" />,
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
            <span>EFFORTLESS WORKFLOW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            How CloudShare{" "}
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Zero friction, uncompromising privacy. Transfer confidential files in four simple steps without ever creating an account.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ step, icon, title, description, detail }) => (
            <div
              key={step}
              className="group relative rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/10 flex flex-col justify-between"
            >
              <div>
                {/* Step number and icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className="h-12 w-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-500/10 group-hover:border-purple-500/30 transition-all duration-300">
                    {icon}
                  </div>
                  <span className="text-3xl font-black text-slate-800 group-hover:text-purple-400/30 transition-colors font-mono">
                    {step}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-200 transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                  {description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 text-xs text-slate-400">
                {detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

