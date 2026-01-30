import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

// ============================================
// MEDICINES
// ============================================

export function useMedicines() {
  return useQuery({
    queryKey: [api.medicines.list.path],
    queryFn: async () => {
      const res = await fetch(api.medicines.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load medicines");
      return api.medicines.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateMedicine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.medicines.create.input>) => {
      const res = await fetch(api.medicines.create.path, {
        method: api.medicines.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to add medicine");
      return api.medicines.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.medicines.list.path] });
    },
  });
}

export function useToggleMedicine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, taken }: { id: number; taken: boolean }) => {
      const url = buildUrl(api.medicines.toggleTaken.path, { id });
      const res = await fetch(url, {
        method: api.medicines.toggleTaken.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taken }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update status");
      return api.medicines.toggleTaken.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.medicines.list.path] });
    },
  });
}

// ============================================
// HEALTH RECORDS
// ============================================

export function useHealthRecords() {
  return useQuery({
    queryKey: [api.healthRecords.list.path],
    queryFn: async () => {
      const res = await fetch(api.healthRecords.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load records");
      return api.healthRecords.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateHealthRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.healthRecords.create.input>) => {
      const res = await fetch(api.healthRecords.create.path, {
        method: api.healthRecords.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to upload record");
      return api.healthRecords.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.healthRecords.list.path] });
    },
  });
}

// ============================================
// MESSAGES (DOCTOR CHAT)
// ============================================

export function useMessages() {
  return useQuery({
    queryKey: [api.messages.list.path],
    queryFn: async () => {
      const res = await fetch(api.messages.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load messages");
      return api.messages.list.responses[200].parse(await res.json());
    },
    refetchInterval: 5000, // Simple polling for demo
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.messages.send.input>) => {
      const res = await fetch(api.messages.send.path, {
        method: api.messages.send.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to send message");
      return api.messages.send.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.messages.list.path] });
    },
  });
}

// ============================================
// AUTH
// ============================================

export function useLogin() {
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.auth.login.input>) => {
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Login failed");
      const user = await res.json();
      // Simple client-side session simulation
      localStorage.setItem("sehat_user", JSON.stringify(user));
      return user;
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.auth.logout.path, {
        method: api.auth.logout.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Logout failed");
      localStorage.removeItem("sehat_user");
    },
  });
}
