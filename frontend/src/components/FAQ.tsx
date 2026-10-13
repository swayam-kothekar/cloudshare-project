import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "How does client-side AES-256 encryption work?",
    answer:
      "When you choose files, your browser generates a random 256-bit AES key and encrypts the files locally using the native Web Cryptography API before any network request is made. The decryption key is embedded in the URL fragment (#key=...), which web browsers never transmit to the server. Consequently, only the recipient holding your link can decrypt the file.",
    value: "item-1",
  },
  {
    question: "What happens when a file reaches its expiry time or download limit?",
    answer:
      "CloudShare implements strict ephemeral storage. Once your chosen time expires (1 minute to 24 hours) or the download counter hits your threshold (e.g., burn after 1 download), the encrypted ciphertext is immediately and permanently deleted from our cloud storage. It cannot be recovered by anyone.",
    value: "item-2",
  },
  {
    question: "Do I need to register or create an account?",
    answer:
      "No! CloudShare requires zero registration. You never need to supply an email address, password, or credit card. There are no tracking cookies or personal data stored on our servers.",
    value: "item-3",
  },
  {
    question: "What is the maximum file size limit?",
    answer:
      "You can upload single files or bundles of multiple files up to 50MB in total. Multiple files are automatically zipped into an archive directly inside your browser before encryption.",
    value: "item-4",
  },
  {
    question: "Can recipients download files on mobile phones?",
    answer:
      "Yes! Every generated share link includes a high-resolution QR code that any mobile camera can scan. The recipient's mobile browser handles decryption and downloads the files directly to their device.",
    value: "item-5",
  },
  {
    question: "Can CloudShare or cloud providers view my files?",
    answer:
      "No. Because encryption occurs inside your browser before transmission, and the decryption key resides only in the link you share, neither CloudShare nor any cloud infrastructure provider can view, inspect, or reconstruct your raw files.",
    value: "item-6",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="relative py-24 sm:py-32 scroll-mt-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Security &{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              Privacy FAQ
            </span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto">
            Got questions about how CloudShare handles your data? Here is everything you need to know about our cryptographic model.
          </p>
        </div>

        {/* Accordion container */}
        <div className="rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-xl p-4 sm:p-6 shadow-2xl">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {FAQList.map(({ question, answer, value }: FAQProps) => (
              <AccordionItem
                key={value}
                value={value}
                className="border border-white/5 rounded-xl px-4 bg-white/[0.02] hover:bg-white/[0.04] transition-colors overflow-hidden"
              >
                <AccordionTrigger className="text-left text-base sm:text-lg font-medium text-white hover:text-indigo-300 transition-colors py-4">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-zinc-300 leading-relaxed pb-4 pt-1">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA banner below FAQ */}
        <div className="mt-12 text-center p-8 sm:p-10 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-md relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          <h3 className="text-xl font-bold text-white mb-2">
            Ready to transfer files with zero footprint?
          </h3>
          <p className="text-sm text-zinc-400 mb-6 max-w-md mx-auto">
            Experience military-grade encryption without the hassle of accounts or complicated software.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 border border-indigo-400/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_16px_rgba(79,70,229,0.35)] transition-all duration-150 active:scale-[0.99]"
          >
            <span>Start Uploading Now</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

