import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { config } from "./lib/wagmi";
import "@rainbow-me/rainbowkit/styles.css";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import Marketplace from "@/pages/Marketplace";
import Staking from "@/pages/Staking";
import Profile from "@/pages/Profile";
import MiningPage from "@/pages/MiningPage";
import DashboardPage from "@/pages/DashboardPage";
import OnboardingHUD from "@/components/OnboardingHUD";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/Layout";

function Router() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          
          <Layout>
            <div className="min-h-screen bg-[#0a0a0c] text-white">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/marketplace" component={Marketplace} />
                <Route path="/staking" component={Staking} />
                <Route path="/profile" component={Profile} />
                <Route path="/mining" component={MiningPage} />
                <Route path="/dashboard" component={DashboardPage} />
                <Route component={NotFound} />
              </Switch>
              <OnboardingHUD />
              <Toaster />
            </div>
          </Layout>

        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default Router;
