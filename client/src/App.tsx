import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { config } from "./lib/wagmi";
import "@rainbow-me/rainbowkit/styles.css"; // อย่าลืมบรรทัดนี้ ไม่งั้นปุ่มจะเพี้ยน!
import { Toaster } from "@/components/ui/toaster";

// Import หน้าต่างๆ
import Home from "@/pages/Home";
import Marketplace from "@/pages/Marketplace";
import Staking from "@/pages/Staking";
import Profile from "@/pages/Profile";
import MiningPage from "@/pages/MiningPage";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/Layout";

function Router() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <Layout>
            <Switch>
               {/* ใส่ Route ของคุณตรงนี้ */}
              <Route path="/" component={Home} />
              <Route path="/marketplace" component={Marketplace} />
              <Route path="/staking" component={Staking} />
              <Route path="/profile" component={Profile} />
              <Route path="/mining" component={MiningPage} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
          <Toaster />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default Router;