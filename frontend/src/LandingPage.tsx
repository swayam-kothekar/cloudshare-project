import { FAQ } from "./components/FAQ";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Navbar } from "./components/Navbar";
import { ScrollToTop } from "./components/ScrollToTop";
import "./App.css";

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* Subtle background ambient mesh with grid depth */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Architectural subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />

        {/* Primary top aura: deep indigo/violet */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[950px] h-[480px] bg-indigo-600/15 blur-[150px] rounded-full" />
        
        {/* Subtle emerald/teal ambient glow on left */}
        <div className="absolute top-[30%] -left-48 w-[600px] h-[600px] bg-emerald-500/[0.04] blur-[160px] rounded-full" />
        
        {/* Subtle amber/rose warm ambient glow on right */}
        <div className="absolute top-[65%] -right-48 w-[600px] h-[600px] bg-amber-500/[0.04] blur-[160px] rounded-full" />
      </div>

      <Navbar />
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <Features />
        <FAQ />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default LandingPage;

