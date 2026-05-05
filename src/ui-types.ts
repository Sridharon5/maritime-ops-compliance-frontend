import type { CrewMember, Ship } from "./types";

export type AdminTab = "Dashboard" | "Maintenance" | "Drills";
export type SetupTab = "Ships & Crew";
export type CrewTab = "My Work";
export type AppTab = AdminTab | SetupTab | CrewTab;

export type EntityMap<T extends { id: string }> = Record<string, T>;

export type TaskForm = {
  shipId: Ship["id"];
  title: string;
  description: string;
  assignedCrewId: CrewMember["id"];
  dueDate: string;
};

export type DrillForm = {
  shipId: Ship["id"];
  type: string;
  scheduledDate: string;
  assignedCrewIds: CrewMember["id"][];
};

export type ShipForm = {
  name: string;
  imo: string;
};

export type CrewForm = {
  name: string;
  role: string;
  shipId: Ship["id"];
};
