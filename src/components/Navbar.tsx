import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Navigation links configuration
const navLinks = [
  { name: "Home", path: "/" },
  { name: "Learn", path: "/learn" },
  { name: "Practice", path: "/practice" },
  { name: "Prompt Library", path: "/library" },
  { name: "Challenges", path: "/challenges" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "About", path: "/about" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xl font-bold transition-all duration-300 hover:scale-105"
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple">
              <Sparkles className="w-5 h-5 text-background" />
            </div>
            <span className="text-gradient">PromptLab</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                  location.pathname === link.path
                    ? "text-neon-blue bg-neon-blue/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:block">
            <Button variant="neon" size="sm">
              Start Practicing
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            isOpen ? "max-h-[500px] pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-2 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300",
                  location.pathname === link.path
                    ? "text-neon-blue bg-neon-blue/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Button variant="neon" className="mt-2">
              Start Practicing
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
