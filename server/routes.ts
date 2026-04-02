
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

// Smart doctor replies pool
const DOCTOR_REPLIES = [
  "Thank you for letting me know. Please rest well and drink plenty of water.",
  "I understand. Have you checked your blood pressure today? Keep monitoring it daily.",
  "That's good to hear. Keep taking your medicines on time and avoid salty foods.",
  "Please don't skip your medicines. Take them with food if you feel uneasy.",
  "I recommend you visit the nearest clinic if the pain continues for more than 2 days.",
  "Your concern is noted. Maintain a light diet and avoid stress. I'll review your records.",
  "Thank you for the update. Are you experiencing any other symptoms like dizziness or nausea?",
  "Please upload your latest test reports so I can review them. Also note down your blood sugar today.",
  "Make sure you are sleeping at least 7-8 hours. Rest is very important for recovery.",
  "Drink warm water with a pinch of turmeric before sleeping. It helps with inflammation.",
];

function getSmartReply(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  if (msg.includes("headache") || msg.includes("head")) {
    return "For headaches, try resting in a dark room and drink water. If it persists beyond 2 days or is very severe, please visit a clinic immediately.";
  }
  if (msg.includes("bp") || msg.includes("blood pressure") || msg.includes("pressure")) {
    return "High BP needs careful monitoring. Please check your BP reading right now and note it down. Avoid salt, stress, and take your Amlodipine as scheduled.";
  }
  if (msg.includes("missed") || msg.includes("forgot") || msg.includes("skip")) {
    return "It's okay, please take your medicine now if it's not too late. Never double the dose. Try setting an alarm reminder on SehatSaathi.";
  }
  if (msg.includes("weak") || msg.includes("tired") || msg.includes("fatigue")) {
    return "Weakness can be due to low blood sugar or dehydration. Please eat something light and drink water. If it doesn't improve in an hour, call a family member.";
  }
  if (msg.includes("sugar") || msg.includes("diabetes") || msg.includes("glucose")) {
    return "Please check your blood sugar level immediately. Note the reading and time. If it's below 70 or above 250, please contact me or visit a clinic right away.";
  }
  if (msg.includes("pain") || msg.includes("ache")) {
    return "Please describe the location and intensity of your pain (1-10 scale). For now, rest and avoid heavy activity. I will review and advise you shortly.";
  }
  if (msg.includes("medicine") || msg.includes("tablet") || msg.includes("dose")) {
    return "Take your medicines exactly as scheduled. Always take them with food or water as instructed. Do not stop any medicine without consulting me.";
  }
  // Random fallback
  return DOCTOR_REPLIES[Math.floor(Math.random() * DOCTOR_REPLIES.length)];
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Helper to get userId from request (query param for GET, body for POST)
  const getUserId = (req: any): number | null => {
    const id = Number(req.query.userId || req.body?.userId);
    return isNaN(id) || id === 0 ? null : id;
  };

  // ─── AUTH ────────────────────────────────────────────────────────
  app.post(api.auth.login.path, async (req, res) => {
    try {
      const { phoneNumber, name } = api.auth.login.input.parse(req.body);
      let user = await storage.getUserByPhone(phoneNumber);
      if (!user) {
        user = await storage.createUser({ phoneNumber, name: name || "User", language: "english" });
        await seedUserData(user.id);
        res.status(201).json(user);
      } else {
        if (name && name !== "User" && name !== user.name) {
          // Update name if provided differently (re-login with name)
        }
        res.status(200).json(user);
      }
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.auth.logout.path, (_req, res) => {
    res.json({ message: "Logged out" });
  });

  // ─── MEDICINES ───────────────────────────────────────────────────
  app.get(api.medicines.list.path, async (req, res) => {
    const userId = getUserId(req);
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

  // Update medicine
  app.patch("/api/medicines/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const data = req.body;
      const med = await storage.updateMedicine(id, data);
      res.json(med);
    } catch (err) {
      res.status(400).json({ message: "Failed to update medicine" });
    }
  });

  // Delete medicine
  app.delete("/api/medicines/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.deleteMedicine(id);
      res.json({ message: "Deleted" });
    } catch (err) {
      res.status(400).json({ message: "Failed to delete" });
    }
  });

  // Reset all medicines for the day
  app.post("/api/medicines/reset", async (req, res) => {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
      await storage.resetAllMedicines(userId);
      res.json({ message: "Reset successful" });
    } catch (err) {
      res.status(400).json({ message: "Failed to reset" });
    }
  });

  // ─── HEALTH RECORDS ──────────────────────────────────────────────
  app.get(api.healthRecords.list.path, async (req, res) => {
    const userId = getUserId(req);
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

  // Delete health record
  app.delete("/api/records/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.deleteHealthRecord(id);
      res.json({ message: "Deleted" });
    } catch (err) {
      res.status(400).json({ message: "Failed to delete" });
    }
  });

  // ─── MESSAGES ────────────────────────────────────────────────────
  app.get(api.messages.list.path, async (req, res) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const msgs = await storage.getMessages(userId);
    res.json(msgs);
  });

  app.post(api.messages.send.path, async (req, res) => {
    try {
      const input = api.messages.send.input.parse(req.body);
      const msg = await storage.createMessage(input);
      if (input.sender === "user") {
        setTimeout(async () => {
          await storage.createMessage({
            userId: input.userId,
            sender: "doctor",
            content: getSmartReply(input.content || ""),
            type: "text"
          });
        }, 1800);
      }
      res.status(201).json(msg);
    } catch (err) {
      res.status(400).json({ message: "Failed to send message" });
    }
  });

  return httpServer;
}

async function seedUserData(userId: number) {
  await storage.createMedicine({ userId, name: "Metformin", dosage: "500mg", frequency: "Twice Daily", time: "08:00", type: "pill", instructions: "Take with breakfast" });
  await storage.createMedicine({ userId, name: "Amlodipine", dosage: "5mg", frequency: "Once Daily", time: "21:00", type: "pill", instructions: "Take before sleep" });
  await storage.createMedicine({ userId, name: "Vitamin D3", dosage: "1 capsule", frequency: "Once Daily", time: "09:00", type: "pill", instructions: "Take after meal" });
  await storage.createHealthRecord({ userId, type: "prescription", date: new Date().toLocaleDateString(), doctorName: "Dr. Anjali Sharma", notes: "Monthly prescription", imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=300&auto=format&fit=crop" });
  await storage.createMessage({ userId, sender: "doctor", content: "Welcome to SehatSaathi! I am Dr. Anjali Sharma. Please take your medicines on time and stay healthy. Feel free to ask me any health questions.", type: "text" });
}
