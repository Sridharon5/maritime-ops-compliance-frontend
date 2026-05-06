import type { ComplianceSummary, CrewMember, MaintenanceTask, SafetyDrill, Ship, TaskStatus } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const { headers: extraHeaders, ...restOptions } = options ?? {};
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(extraHeaders ?? {}) },
    ...restOptions
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

export const api = {
  ships: () => request<Ship[]>("/ships"),
  crew: () => request<CrewMember[]>("/crew"),
  createShip: (body: { name: string; imo: string }) =>
    request<Ship>("/ships", {
      method: "POST",
      headers: { "x-user-role": "admin" },
      body: JSON.stringify(body)
    }),
  createCrewMember: (body: { name: string; role: string; shipId: string }) =>
    request<CrewMember>("/crew", {
      method: "POST",
      headers: { "x-user-role": "admin" },
      body: JSON.stringify(body)
    }),
  maintenance: (params = "") => request<MaintenanceTask[]>(`/maintenance${params}`),
  drills: (params = "") => request<SafetyDrill[]>(`/drills${params}`),
  compliance: (params = "") => request<ComplianceSummary>(`/compliance${params}`),
  createMaintenance: (body: {
    shipId: string;
    title: string;
    description: string;
    assignedCrewId: string;
    dueDate: string;
  }) =>
    request<MaintenanceTask>("/maintenance", {
      method: "POST",
      headers: { "x-user-role": "admin" },
      body: JSON.stringify(body)
    }),
  updateMaintenance: (id: string, body: { status?: TaskStatus; note?: string }) =>
    request<MaintenanceTask>(`/maintenance/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body)
    }),
  createDrill: (body: {
    shipId: string;
    type: string;
    scheduledDate: string;
    assignedCrewIds: string[];
  }) =>
    request<SafetyDrill>("/drills", {
      method: "POST",
      headers: { "x-user-role": "admin" },
      body: JSON.stringify(body)
    }),
  markAttendance: (id: string, crewId: string) =>
    request<SafetyDrill>(`/drills/${id}/attendance`, {
      method: "POST",
      body: JSON.stringify({ crewId })
    }),
  completeDrill: (id: string, notes: string) =>
    request<SafetyDrill>(`/drills/${id}/complete`, {
      method: "PATCH",
      body: JSON.stringify({ notes })
    })
};
