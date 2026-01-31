import { Link, useLocation } from "wouter";
import { ConnectWallet } from "./ConnectWallet";
import { AiAssistant } from "./AiAssistant";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "./ui/button";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Mining", href: "/mining" },
  { label: "Staking", href: "/staking" },
  { label: "Profile", href: "/profile" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <header className="fixed top-0 w-full z-40 border-b border-white/5 bg-background/60 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-white/10 group-hover:border-primary/50 transition-colors">
              <img src="/logo.jpeg" alt="MeeChain Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-white group-hover:text-primary transition-colors">
              MeeChain
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  location === item.href 
                    ? "bg-white/10 text-white" 
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ConnectWallet />
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-4">
            <ConnectWallet />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] glass-card border-l border-white/10">
                <div className="flex flex-col gap-6 mt-10">
                  {NAV_ITEMS.map((item) => (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      className={cn(
                        "text-lg font-medium px-4 py-2 rounded-xl transition-colors",
                        location === item.href
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:text-white"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20 relative z-10">
        {children}
      </main>

      <AiAssistant />

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/20 backdrop-blur-sm py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 MeeChain Ecosystem. Built for the future of decentralized applications.
          </p>
        </div>
      </footer>
    </div>
  );
}
