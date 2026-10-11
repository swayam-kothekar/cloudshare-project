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
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/80 border-b border-white/10">
      <NavigationMenu className="mx-auto max-w-7xl px-4 sm:px-6">
        <NavigationMenuList className="h-16 w-full flex justify-between items-center">
          {/* Logo */}
          <NavigationMenuItem className="font-bold flex">
            <Link
              to="/"
              className="flex items-center gap-2.5 group transition-transform"
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-pink-500 p-2 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform duration-200">
                <CloudLogo className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                CloudShare
              </span>
            </Link>
          </NavigationMenuItem>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {routeList.map((route: RouteProps) => (
              <a
                key={route.label}
                href={route.href}
                onClick={() => handleNavClick(route.href)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                {route.label}
              </a>
            ))}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-md shadow-purple-500/20 hover:shadow-purple-500/35 transition-all duration-200 hover:scale-[1.02]"
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
                  className="p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                  aria-label="Toggle menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>

              <SheetContent side="right" className="bg-background/95 backdrop-blur-2xl border-white/10 w-72">
                <SheetHeader className="text-left border-b border-white/10 pb-4">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 p-1.5 flex items-center justify-center">
                      <CloudLogo className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold text-lg text-white">CloudShare</span>
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-2 mt-6">
                  {routeList.map(({ href, label }: RouteProps) => (
                    <a
                      key={label}
                      href={href}
                      onClick={() => handleNavClick(href)}
                      className="px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/80 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {label}
                    </a>
                  ))}
                  <div className="pt-4 border-t border-white/10 mt-2">
                    <Link
                      to="/upload"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-md shadow-purple-500/25"
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

