import type { ComplianceSummary, CrewMember, MaintenanceTask, SafetyDrill, Ship, TaskStatus } from "./types";
import type { PaginatedResponse } from "./ui-types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

type QueryParams = Record<string, string | number | undefined>;

function toQueryString(params: QueryParams = {}): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") query.set(key, String(value));
  }
  const text = query.toString();
  return text ? `?${text}` : "";
}

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
  crew: (params: QueryParams = {}) => request<CrewMember[]>(`/crew${toQueryString(params)}`),
  paginatedShips: (page: number, limit: number) =>
    request<PaginatedResponse<Ship>>(`/ships${toQueryString({ page, limit })}`),
  paginatedCrew: (params: { shipId?: string; page: number; limit: number }) =>
    request<PaginatedResponse<CrewMember>>(`/crew${toQueryString(params)}`),
  paginatedMaintenance: (params: {
    shipId?: string;
    status?: string;
    crewId?: string;
    dueFrom?: string;
    dueTo?: string;
    page: number;
    limit: number;
  }) => request<PaginatedResponse<MaintenanceTask>>(`/maintenance${toQueryString(params)}`),
  paginatedDrills: (params: {
    shipId?: string;
    status?: string;
    crewId?: string;
    scheduledFrom?: string;
    scheduledTo?: string;
    page: number;
    limit: number;
  }) => request<PaginatedResponse<SafetyDrill>>(`/drills${toQueryString(params)}`),
  maintenance: (params: QueryParams = {}) => request<MaintenanceTask[]>(`/maintenance${toQueryString(params)}`),
  drills: (params: QueryParams = {}) => request<SafetyDrill[]>(`/drills${toQueryString(params)}`),
  compliance: (params = "") => request<ComplianceSummary>(`/compliance${params}`),
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
