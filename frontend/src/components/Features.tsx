import {
  Lock,
  Clock,
  Flame,
  Link2,
  FolderArchive,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "./ui/badge";

interface FeatureCardProps {
  icon: React.ReactNode;
  badge: string;
  title: string;
  description: string;
}

const featureList: string[] = [
  "Client-Side AES-256",
  "Auto-Expiring Links",
  "Strict Download Limits",
  "Custom Short URLs",
  "Instant QR Codes",
  "Zero Registration",
  "Multi-File Zip Bundles",
  "50MB Payload",
];

const features: FeatureCardProps[] = [
  {
    icon: <Lock className="h-6 w-6 text-purple-400" />,
    badge: "Maximum Security",
    title: "Client-Side AES-256-GCM",
    description:
      "Files are encrypted inside your browser before transmission. The decryption key remains in the URL hash fragment and is never sent to our servers.",
  },
  {
    icon: <Clock className="h-6 w-6 text-fuchsia-400" />,
    badge: "Auto-Purge",
    title: "Configurable Expiration",
    description:
      "Choose exactly how long your files stay alive: 1 minute, 5 minutes, 1 hour, or 24 hours. Once time expires, the cloud storage deletes the file permanently.",
  },
  {
    icon: <Flame className="h-6 w-6 text-rose-400" />,
    badge: "Anti-Leak",
    title: "Strict Download Limits",
    description:
      "Restrict files to burn after a single download, or choose up to 1000 downloads. Once the threshold is met, the file is immediately purged.",
  },
  {
    icon: <Link2 className="h-6 w-6 text-indigo-400" />,
    badge: "Fast Sharing",
    title: "Custom Short URLs & QR",
    description:
      "Create clean, human-readable short links (e.g., /share/my-notes) or generate instant QR codes for rapid sharing across mobile and desktop devices.",
  },
  {
    icon: <FolderArchive className="h-6 w-6 text-violet-400" />,
    badge: "In-Browser Zip",
    title: "Multi-File Packaging",
    description:
      "Select multiple documents, photos, or data files at once. They are zipped client-side and encrypted into a single lightweight download container.",
  },
  {
    icon: <EyeOff className="h-6 w-6 text-emerald-400" />,
    badge: "True Privacy",
    title: "Zero Accounts & Zero Logs",
    description:
      "No login required, no email collected, no tracking scripts, and no IP address logs. Complete anonymity for your most sensitive transfers.",
  },
];

export const Features = () => {
  return (
    <section id="features" className="relative py-24 sm:py-32 scroll-mt-12 bg-white/[0.01]">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
            <span>ENGINEERED FOR PRIVACY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Powerful Features for{" "}
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Fearless Sharing
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Everything you need to share confidential documents, secrets, and files without leaving a trace on the web.
          </p>

          {/* Real capability pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4 max-w-3xl mx-auto">
            {featureList.map((feature: string) => (
              <Badge
                key={feature}
                variant="secondary"
                className="bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10 px-3 py-1 text-xs font-medium rounded-full transition-colors"
              >
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        {/* 6 Features Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon, badge, title, description }: FeatureCardProps) => (
            <div
              key={title}
              className="group relative rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-7 transition-all duration-300 hover:border-purple-500/35 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="h-12 w-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:scale-105 group-hover:bg-purple-500/10 group-hover:border-purple-500/30 transition-all duration-200">
                    {icon}
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                    {badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-purple-200 transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-white/5 flex items-center text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                <ShieldCheck className="h-3.5 w-3.5 text-purple-400 mr-1.5 flex-shrink-0" />
                <span>Zero-knowledge verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

