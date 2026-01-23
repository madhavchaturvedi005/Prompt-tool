import { Link } from "react-router-dom";
import { Sparkles, Github, Twitter, Linkedin, Mail } from "lucide-react";

const footerLinks = {
  Platform: [
    { name: "Learn", path: "/learn" },
    { name: "Practice", path: "/practice" },
    { name: "Challenges", path: "/challenges" },
    { name: "Library", path: "/library" },
  ],
  Resources: [
    { name: "Documentation", path: "/docs" },
    { name: "Blog", path: "/blog" },
    { name: "Tutorials", path: "/tutorials" },
    { name: "API", path: "/api" },
  ],
  Company: [
    { name: "About", path: "/about" },
    { name: "Careers", path: "/careers" },
    { name: "Contact", path: "/contact" },
    { name: "Press", path: "/press" },
  ],
  Legal: [
    { name: "Privacy", path: "/privacy" },
    { name: "Terms", path: "/terms" },
    { name: "Cookies", path: "/cookies" },
  ],
};

const socialLinks = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "#", label: "Email" },
];

export function Footer() {
  return (
    <footer className="relative pt-24 pb-12 border-t border-border bg-card/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 text-xl font-heading font-semibold mb-4">
              <Sparkles className="w-6 h-6 text-foreground" />
              <span className="text-foreground">PromptLab</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs leading-relaxed">
              Master the art of AI communication with expertly crafted 
              learning paths and hands-on practice.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-all"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-heading font-semibold mb-4 text-foreground">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="divider mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2025 PromptLab. All rights reserved.</p>
          <p>
            Crafted with <span className="text-foreground">excellence</span> for the discerning learner
          </p>
        </div>
      </div>
    </footer>
  );
}
