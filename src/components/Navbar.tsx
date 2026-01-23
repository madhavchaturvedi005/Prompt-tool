import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Learn", path: "/learn" },
  { name: "Practice", path: "/practice" },
  { name: "Library", path: "/library" },
  { name: "Challenges", path: "/challenges" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "About", path: "/about" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 text-xl font-heading font-semibold transition-all duration-300 hover:opacity-80"
          >
            <Sparkles className="w-6 h-6 text-foreground" />
            <span className="text-foreground">PromptLab</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-all duration-300 relative",
                  location.pathname === link.path
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.name}
                {location.pathname === link.path && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-foreground" />
                )}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button variant="default" size="sm">
              Start Learning
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 border-t border-border",
            isOpen ? "max-h-[500px] py-4" : "max-h-0 py-0 border-t-0"
          )}
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "px-4 py-3 text-sm font-medium transition-all duration-300",
                  location.pathname === link.path
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 px-4">
              <Button variant="default" className="w-full">
                Start Learning
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
