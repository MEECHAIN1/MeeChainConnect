import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.profiles.get.path, async (req, res) => {
    const { walletAddress } = req.params;
    const profile = await storage.getProfile(walletAddress);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  });

  app.post(api.profiles.update.path, async (req, res) => {
    try {
      const input = api.profiles.update.input.parse(req.body);
      // Since it's an update/create upsert logic in storage, we use updateProfile
      // But routes definition says "update" input is insertProfileSchema? 
      // Let's just pass it to updateProfile which handles creation if needed
      const profile = await storage.updateProfile(input.walletAddress, input);
      res.json(profile);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.post("/api/wallets", async (req, res) => {
    try {
      const walletData = req.body;
      const newWallet = await storage.createWallet({
        id: walletData.id,
        address: walletData.address,
        name: walletData.name,
        type: walletData.type,
        ownerAddress: walletData.ownerId,
        isDeployed: walletData.isDeployed,
        balanceNative: String(walletData.balance?.native || "0")
      });
      res.json(newWallet);
    } catch (error) {
      res.status(500).json({ message: "Failed to sync wallet" });
    }
  });

  app.post("/api/mining/sync", async (req, res) => {
    try {
      const { walletAddress, energy, tokens } = req.body;
      const updated = await storage.updateMiningStats(walletAddress, energy, tokens);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to sync mining stats" });
    }
  });

  return httpServer;
}
