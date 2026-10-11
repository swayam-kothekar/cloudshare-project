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
      {/* Subtle background ambient mesh */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-purple-600/15 via-fuchsia-600/5 to-transparent blur-[140px]" />
        <div className="absolute top-[40%] -left-40 w-[600px] h-[600px] bg-indigo-600/5 blur-[150px] rounded-full" />
        <div className="absolute top-[70%] -right-40 w-[600px] h-[600px] bg-pink-600/5 blur-[150px] rounded-full" />
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

