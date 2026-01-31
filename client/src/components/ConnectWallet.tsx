import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { injected } from "wagmi/connectors";
import { Button } from "./ui/button";
import { Wallet, LogOut, Loader2, CreditCard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatEther } from "viem";

export function ConnectWallet() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  
  const { data: balance } = useBalance({
    address,
  });

  if (isConnecting) {
    return (
      <Button variant="glass" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="glass" className="font-mono">
            <Wallet className="mr-2 h-4 w-4 text-primary" />
            {address.slice(0, 6)}...{address.slice(-4)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 glass-card border-white/10">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
             Balance: <span className="text-foreground font-medium">{balance ? `${Number(formatEther(balance.value)).toFixed(4)} ${balance.symbol}` : '...'}</span>
          </div>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem onClick={() => disconnect()} className="text-destructive focus:text-destructive cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button 
      onClick={() => connect({ connector: injected() })}
      variant="glow"
    >
      <CreditCard className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  );
}
