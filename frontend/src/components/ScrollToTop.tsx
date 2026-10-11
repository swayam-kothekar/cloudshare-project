import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export const ScrollToTop = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!showTopBtn) return null;

  return (
    <button
      onClick={goToTop}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-50 h-11 w-11 rounded-xl bg-slate-900/90 border border-white/20 text-white shadow-xl shadow-purple-500/20 backdrop-blur-md flex items-center justify-center hover:bg-purple-600 hover:border-purple-400 hover:scale-110 active:scale-95 transition-all duration-200"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
};

