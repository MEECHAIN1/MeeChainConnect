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

  return httpServer;
}
