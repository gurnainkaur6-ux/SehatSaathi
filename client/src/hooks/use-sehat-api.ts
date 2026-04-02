import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStoredUser() {
  try {
    const raw = localStorage.getItem("sehat_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getUserId(): number {
  return getStoredUser()?.id ?? 0;
}

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, { credentials: "include", ...options });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message || "Request failed");
  }
  return res.json();
}

// ─── MEDICINES ───────────────────────────────────────────────────────────────

export function useMedicines() {
  const userId = getUserId();
  return useQuery({
    queryKey: [api.medicines.list.path, userId],
    queryFn: () => apiFetch(`${api.medicines.list.path}?userId=${userId}`),
    enabled: userId > 0,
  });
}

export function useCreateMedicine() {
  const qc = useQueryClient();
  const userId = getUserId();
  return useMutation({
    mutationFn: (data: z.infer<typeof api.medicines.create.input>) =>
      apiFetch(api.medicines.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.medicines.list.path, userId] }),
  });
}

export function useUpdateMedicine() {
  const qc = useQueryClient();
  const userId = getUserId();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<z.infer<typeof api.medicines.create.input>> }) =>
      apiFetch(`/api/medicines/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.medicines.list.path, userId] }),
  });
}

export function useDeleteMedicine() {
  const qc = useQueryClient();
  const userId = getUserId();
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/api/medicines/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.medicines.list.path, userId] }),
  });
}

export function useToggleMedicine() {
  const qc = useQueryClient();
  const userId = getUserId();
  return useMutation({
    mutationFn: ({ id, taken }: { id: number; taken: boolean }) =>
      apiFetch(buildUrl(api.medicines.toggleTaken.path, { id }), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taken }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.medicines.list.path, userId] }),
  });
}

export function useResetMedicines() {
  const qc = useQueryClient();
  const userId = getUserId();
  return useMutation({
    mutationFn: () =>
      apiFetch("/api/medicines/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.medicines.list.path, userId] }),
  });
}

// ─── HEALTH RECORDS ──────────────────────────────────────────────────────────

export function useHealthRecords() {
  const userId = getUserId();
  return useQuery({
    queryKey: [api.healthRecords.list.path, userId],
    queryFn: () => apiFetch(`${api.healthRecords.list.path}?userId=${userId}`),
    enabled: userId > 0,
  });
}

export function useCreateHealthRecord() {
  const qc = useQueryClient();
  const userId = getUserId();
  return useMutation({
    mutationFn: (data: z.infer<typeof api.healthRecords.create.input>) =>
      apiFetch(api.healthRecords.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.healthRecords.list.path, userId] }),
  });
}

export function useDeleteHealthRecord() {
  const qc = useQueryClient();
  const userId = getUserId();
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/api/records/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.healthRecords.list.path, userId] }),
  });
}

// ─── MESSAGES ────────────────────────────────────────────────────────────────

export function useMessages() {
  const userId = getUserId();
  return useQuery({
    queryKey: [api.messages.list.path, userId],
    queryFn: () => apiFetch(`${api.messages.list.path}?userId=${userId}`),
    enabled: userId > 0,
    refetchInterval: 4000,
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  const userId = getUserId();
  return useMutation({
    mutationFn: (data: z.infer<typeof api.messages.send.input>) =>
      apiFetch(api.messages.send.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.messages.list.path, userId] }),
  });
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export function useLogin() {
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.auth.login.input>) => {
      const user = await apiFetch(api.auth.login.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      localStorage.setItem("sehat_user", JSON.stringify(user));
      return user;
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      await apiFetch(api.auth.logout.path, { method: "POST" });
      localStorage.removeItem("sehat_user");
    },
  });
}
