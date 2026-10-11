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
      "No! CloudShare is built on true zero-knowledge principles. You never need to supply an email address, password, or credit card. There are no tracking cookies or personal data stored on our servers.",
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Security &{" "}
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Privacy FAQ
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            Got questions about how CloudShare handles your data? Here is everything you need to know about our cryptographic model.
          </p>
        </div>

        {/* Accordion container */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-4 sm:p-6 shadow-xl">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {FAQList.map(({ question, answer, value }: FAQProps) => (
              <AccordionItem
                key={value}
                value={value}
                className="border border-white/5 rounded-xl px-4 bg-white/[0.02] hover:bg-white/[0.04] transition-colors overflow-hidden"
              >
                <AccordionTrigger className="text-left text-base sm:text-lg font-medium text-white hover:text-purple-300 transition-colors py-4">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-slate-300 leading-relaxed pb-4 pt-1">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA banner below FAQ */}
        <div className="mt-12 text-center p-8 rounded-2xl bg-gradient-to-r from-purple-900/30 via-slate-900/40 to-pink-900/30 border border-white/10 backdrop-blur-md">
          <h3 className="text-lg font-semibold text-white mb-2">
            Ready to transfer files with zero footprint?
          </h3>
          <p className="text-sm text-slate-400 mb-5 max-w-md mx-auto">
            Experience military-grade encryption without the hassle of accounts or complicated software.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/25 transition-all duration-200"
          >
            <span>Start Uploading Now</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

