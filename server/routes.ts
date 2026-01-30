
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Auth Routes
  app.post(api.auth.login.path, async (req, res) => {
    try {
      const { phoneNumber, name } = api.auth.login.input.parse(req.body);
      
      let user = await storage.getUserByPhone(phoneNumber);
      
      if (!user) {
        // Simple mock signup if user doesn't exist
        user = await storage.createUser({
          phoneNumber,
          name: name || "User",
          language: "english"
        });
        // Seed initial data for new user
        await seedUserData(user.id);
        res.status(201).json(user);
      } else {
        res.status(200).json(user);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    // Session handling would go here, for now it's client-side state
    res.json({ message: "Logged out" });
  });

  // Medicine Routes
  app.get(api.medicines.list.path, async (req, res) => {
    const userId = Number(req.query.userId); // In real app, get from session
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const meds = await storage.getMedicines(userId);
    res.json(meds);
  });

  app.post(api.medicines.create.path, async (req, res) => {
    try {
      const input = api.medicines.create.input.parse(req.body);
      const med = await storage.createMedicine(input);
      res.status(201).json(med);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.patch(api.medicines.toggleTaken.path, async (req, res) => {
    const id = Number(req.params.id);
    const { taken } = req.body;
    const med = await storage.toggleMedicineTaken(id, taken);
    res.json(med);
  });

  // Health Record Routes
  app.get(api.healthRecords.list.path, async (req, res) => {
    const userId = Number(req.query.userId);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const records = await storage.getHealthRecords(userId);
    res.json(records);
  });

  app.post(api.healthRecords.create.path, async (req, res) => {
    try {
      const input = api.healthRecords.create.input.parse(req.body);
      const record = await storage.createHealthRecord(input);
      res.status(201).json(record);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  // Message Routes
  app.get(api.messages.list.path, async (req, res) => {
    const userId = Number(req.query.userId);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const msgs = await storage.getMessages(userId);
    res.json(msgs);
  });

  app.post(api.messages.send.path, async (req, res) => {
    try {
      const input = api.messages.send.input.parse(req.body);
      const msg = await storage.createMessage(input);
      
      // Auto-reply simulation from "Doctor"
      if (input.sender === "user") {
        setTimeout(async () => {
          await storage.createMessage({
            userId: input.userId,
            sender: "doctor",
            content: "Thank you for your update. I will review it and reply shortly.",
            type: "text"
          });
        }, 1500);
      }
      
      res.status(201).json(msg);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  return httpServer;
}

// Helper to seed data for new users
async function seedUserData(userId: number) {
  // Seed Medicines
  await storage.createMedicine({
    userId,
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice Daily",
    time: "8:00 AM",
    type: "pill",
    instructions: "Take with breakfast"
  });
  
  await storage.createMedicine({
    userId,
    name: "Amlodipine",
    dosage: "5mg",
    frequency: "Once Daily",
    time: "9:00 PM",
    type: "pill",
    instructions: "Take before sleep"
  });

  // Seed Messages
  await storage.createMessage({
    userId,
    sender: "doctor",
    content: "Welcome to SehatSaathi! I am Dr. Sharma. Please update your blood sugar levels daily.",
    type: "text"
  });
}
