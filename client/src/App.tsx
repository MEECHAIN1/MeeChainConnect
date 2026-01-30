import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "./lib/wagmi";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import Marketplace from "@/pages/Marketplace";
import Staking from "@/pages/Staking";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";
import ChatPage from "@/pages/ChatPage";
import MiningPage from "@/pages/MiningPage";
import PlaceholderPage from "@/pages/PlaceholderPage";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/marketplace" component={Marketplace} />
        <Route path="/staking" component={Staking} />
        <Route path="/profile" component={Profile} />
        <Route path="/mining" component={MiningPage} />
        <Route path="/chat" component={ChatPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
