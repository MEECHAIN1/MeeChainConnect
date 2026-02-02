import { ethers } from 'ethers';

// ===== TYPES =====
export interface Mission {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  requiredNFTs: string[];
  rewardTokens: string;
  rewardBadgeId?: string;
  completionCriteria: {
    type: 'nft_hold' | 'contract_call' | 'signature' | 'multi_step';
    params: Record<string, any>;
  };
  ipfsMetadata: string; // ipfs:// uri
}

export interface MissionCompletion {
  userId: string;
  missionId: string;
  completedAt: number;
  proofHash: string;
  txHash?: string;
}

export interface NFTCard {
  tokenId: string;
  name: string;
  description: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string }>;
  ipfsUri: string;
  owner: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  awardedAt?: number;
}

const MISSION_TRACKER_ABI = [
  "function completeMission(string _missionId, bytes _proof) external returns (bool success)",
  "function verifyCompletion(address _user, string _missionId) external view returns (bool completed)",
  "function getMissionMetadata(string _missionId) external view returns (string ipfsUri)",
  "function rewardUser(address _user, string _missionId, uint256 _tokenAmount) external returns (bool success)"
];

const NFT_MANAGER_ABI = [
  "function mintNFT(address _to, string _uri) external returns (uint256 tokenId)",
  "function burnNFT(uint256 _tokenId) external returns (bool success)",
  "function evolveNFT(uint256 _tokenId, string _newUri) external returns (bool success)",
  "function balanceOf(address _owner) external view returns (uint256 balance)"
];

const BADGE_SYSTEM_ABI = [
  "function awardBadge(address _user, uint256 _badgeId) external returns (bool success)",
  "function getBadges(address _user) external view returns (uint256[] badgeIds)",
  "function getBadgeMetadata(uint256 _badgeId) external view returns (tuple(string name, string description, string icon, uint8 rarity) metadata)"
];

const CONFIG = {
  CONTRACTS: {
    MISSION_TRACKER: import.meta.env.VITE_MISSION_TRACKER_ADDRESS || ethers.ZeroAddress,
    NFT_MANAGER: import.meta.env.VITE_NFT_MANAGER_ADDRESS || ethers.ZeroAddress,
    BADGE_SYSTEM: import.meta.env.VITE_BADGE_SYSTEM_ADDRESS || ethers.ZeroAddress,
  },
  IPFS_GATEWAY: 'https://gateway.pinata.cloud/ipfs/',
};

export class MissionTracker {
  private contract: ethers.Contract;

  constructor(signer: ethers.Signer) {
    this.contract = new ethers.Contract(
      CONFIG.CONTRACTS.MISSION_TRACKER,
      MISSION_TRACKER_ABI,
      signer
    );
  }

  async completeMission(missionId: string, proof: string) {
    const tx = await this.contract.completeMission(missionId, ethers.hexlify(ethers.toUtf8Bytes(proof)));
    const receipt = await tx.wait();
    return { success: true, txHash: receipt.hash };
  }
}

export class NFTManager {
  private contract: ethers.Contract;

  constructor(signer: ethers.Signer) {
    this.contract = new ethers.Contract(
      CONFIG.CONTRACTS.NFT_MANAGER,
      NFT_MANAGER_ABI,
      signer
    );
  }

  async mintNFT(to: string, uri: string) {
    const tx = await this.contract.mintNFT(to, uri);
    const receipt = await tx.wait();
    return { tokenId: "1", txHash: receipt.hash }; // Simplified
  }
}
