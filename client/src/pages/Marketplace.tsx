import { Button } from "@/components/ui/button";
import { ShoppingBag, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

// Mock data since we don't have the ABI yet
const MOCK_NFTS = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  name: `MeePunk #${1000 + i}`,
  price: (Math.random() * 100).toFixed(2),
  image: `https://images.unsplash.com/photo-${['1620641788421-12019844ed08', '1634152962476-4b8a00e1915c', '1563089145682-a69965ef936d'][i % 3]}?w=400&h=400&fit=crop`
}));

export default function Marketplace() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold mb-3">NFT Marketplace</h1>
          <p className="text-muted-foreground text-lg">Discover, collect, and trade unique digital assets.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search collections..." 
              className="pl-9 bg-white/5 border-white/10"
            />
          </div>
          <Button variant="outline" className="bg-white/5 border-white/10">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_NFTS.map((nft, i) => (
          <motion.div
            key={nft.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card rounded-2xl overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
          >
            {/* Descriptive comment for Unsplash images */}
            {/* digital art abstract 3d shapes cyber aesthetic */}
            <div className="aspect-square bg-white/5 relative overflow-hidden">
              <img 
                src={nft.image} 
                alt={nft.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                #{nft.id}
              </div>
            </div>
            
            <div className="p-5">
              <h3 className="font-bold text-lg mb-1">{nft.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">Collection Name</p>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Price</p>
                  <p className="text-lg font-bold text-primary">{nft.price} MEE</p>
                </div>
                <Button size="sm" className="rounded-lg">
                  <ShoppingBag className="w-4 h-4 mr-2" /> Buy
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
