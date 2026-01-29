import { Link, useLocation } from "wouter";
import { ConnectWallet } from "./ConnectWallet";
import { AiAssistant } from "./AiAssistant";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Web3AuthLogin } from "./Web3AuthLogin"; // เพิ่มบรรทัดนี้

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Staking", href: "/staking" },
  { label: "Profile", href: "/profile" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* ... (Background Orbs คงไว้เหมือนเดิม) ... */}

      <header className="fixed top-0 w-full z-40 border-b border-white/5 bg-background/60 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          
          {/* Logo Section */}
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

          {/* Desktop Actions - ใส่ปุ่ม Web3Auth ตรงนี้ */}
          <div className="hidden md:flex items-center gap-4">
            <Web3AuthLogin /> {/* ปุ่ม Social Login */}
            <ConnectWallet /> {/* ปุ่ม Wallet ปกติ */}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            <Web3AuthLogin /> {/* แสดงใน Mobile ด้วย */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] glass-card border-l border-white/10">
                 {/* ... (เนื้อหาใน Sheet คงเดิม) ... */}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content & Footer คงเดิม */}
      <main className="flex-1 pt-20 relative z-10">{children}</main>
      <AiAssistant />
      {/* ... */}
    </div>
  );
}