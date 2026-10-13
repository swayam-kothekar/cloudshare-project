import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, UploadCloud, ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { CloudLogo } from "./Icons";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "/#howItWorks",
    label: "How It Works",
  },
  {
    href: "/#features",
    label: "Features",
  },
  {
    href: "/#faq",
    label: "FAQ",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const location = useLocation();

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("/#") && location.pathname === "/") {
      const elementId = href.replace("/#", "");
      const elem = document.getElementById(elementId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-zinc-950/80 border-b border-white/[0.08]">
      <NavigationMenu className="mx-auto max-w-7xl px-4 sm:px-6">
        <NavigationMenuList className="h-16 w-full flex justify-between items-center">
          {/* Logo */}
          <NavigationMenuItem className="font-bold flex">
            <Link
              to="/"
              onClick={() => {
                if (location.pathname === "/") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="flex items-center gap-2.5 group transition-transform"
            >
              <CloudLogo className="h-9 w-9 drop-shadow-[0_4px_16px_rgba(59,130,246,0.35)] group-hover:scale-105 transition-transform" />
              <span className="font-bold text-xl tracking-tight text-white flex items-center">
                Cloud<span className="text-indigo-400">Share</span>
              </span>
            </Link>
          </NavigationMenuItem>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {routeList.map((route: RouteProps) => (
              <Link
                key={route.label}
                to={route.href}
                onClick={() => handleNavClick(route.href)}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
              >
                {route.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/upload"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 border border-indigo-400/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_2px_10px_rgba(79,70,229,0.3)] transition-all duration-150 active:scale-[0.99]"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Upload Files</span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button
                  className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                  aria-label="Toggle menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>

              <SheetContent side="right" className="bg-zinc-950/95 backdrop-blur-2xl border-white/10 w-72">
                <SheetHeader className="text-left border-b border-white/10 pb-4">
                  <SheetTitle className="flex items-center gap-2">
                    <CloudLogo className="h-8 w-8 rounded-lg shadow-sm" />
                    <span className="font-bold text-lg text-white">
                      Cloud<span className="text-indigo-400">Share</span>
                    </span>
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-2 mt-6">
                  {routeList.map(({ href, label }: RouteProps) => (
                    <Link
                      key={label}
                      to={href}
                      onClick={() => handleNavClick(href)}
                      className="px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                  <div className="pt-4 border-t border-white/10 mt-2">
                    <Link
                      to="/upload"
                      onClick={() => {
                        setIsOpen(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 border border-indigo-400/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-150"
                    >
                      <UploadCloud className="h-4 w-4" />
                      <span>Upload Files</span>
                      <ArrowRight className="h-4 w-4 ml-auto" />
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};

