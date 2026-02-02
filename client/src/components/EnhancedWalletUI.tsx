
import { ethers } from 'ethers';
import { useEnhancedWallet } from '../hooks/useEnhancedWallet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Wallet, LogIn, LogOut, Plus, Send, Shield, Zap, Copy, Check } from 'lucide-react';

interface EnhancedWalletUIProps {
  web3AuthClientId: string;
  onMintSuccess?: (txHash: string) => void;
  onMissionComplete?: (missionId: string, walletAddress: string) => void;
}

export const EnhancedWalletUI: React.FC<EnhancedWalletUIProps> = ({
  web3AuthClientId,
  onMintSuccess,
  onMissionComplete,
}) => {
  const wallet = useEnhancedWallet(web3AuthClientId);
  const [activeTab, setActiveTab] = useState<'wallets' | 'send' | 'recovery' | 'missions'>('wallets');
  const [sendTo, setSendTo] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [isGasless, setIsGasless] = useState(false);

  if (!wallet.isInitialized) return <div className="p-8 text-center">Initializing...</div>;

  if (!wallet.isConnected) {
    return (
      <Card className="max-w-md mx-auto mt-10">
        <CardHeader className="text-center">
          <Wallet className="w-12 h-12 mx-auto text-primary mb-2" />
          <CardTitle>MeeChain Wallet</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={wallet.login} className="w-full">
            <LogIn className="w-4 h-4 mr-2" /> Connect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>MeeChain Wallet</CardTitle>
            <p className="text-sm text-muted-foreground">{wallet.userEmail}</p>
          </div>
          <Button variant="destructive" onClick={wallet.logout} size="sm">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </CardHeader>
        {wallet.activeWallet && (
          <CardContent>
            <div className="bg-accent/50 p-4 rounded-lg">
              <div className="text-sm font-medium mb-1">{wallet.activeWallet.name}</div>
              <div className="text-2xl font-bold">{wallet.activeWallet.balance.native} ROSE</div>
              <div className="text-xs font-mono mt-1 opacity-70">{wallet.activeWallet.address}</div>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="flex gap-2">
        <Button variant={activeTab === 'wallets' ? 'default' : 'ghost'} onClick={() => setActiveTab('wallets')} className="flex-1">Wallets</Button>
        <Button variant={activeTab === 'send' ? 'default' : 'ghost'} onClick={() => setActiveTab('send')} className="flex-1">Send</Button>
        <Button variant={activeTab === 'recovery' ? 'default' : 'ghost'} onClick={() => setActiveTab('recovery')} className="flex-1">Recovery</Button>
      </div>

      {activeTab === 'wallets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wallet.wallets.map(w => (
            <Card key={w.id} className={`cursor-pointer ${wallet.activeWallet?.id === w.id ? 'ring-2 ring-primary' : ''}`} onClick={() => wallet.selectWallet(w.id)}>
              <CardContent className="p-4">
                <div className="font-bold">{w.name}</div>
                <div className="text-xs opacity-70">{w.address.slice(0, 10)}...</div>
                <Badge variant="outline" className="mt-2">{w.type}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'send' && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <Input placeholder="Recipient Address" value={sendTo} onChange={e => setSendTo(e.target.value)} />
            <Input placeholder="Amount" value={sendAmount} onChange={e => setSendAmount(e.target.value)} />
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={isGasless} onChange={e => setIsGasless(e.target.checked)} />
              <label className="text-sm">Gasless Transaction (3 daily left)</label>
            </div>
            <Button className="w-full" onClick={() => wallet.sendTransaction(sendTo, sendAmount)}>Send Transaction</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
