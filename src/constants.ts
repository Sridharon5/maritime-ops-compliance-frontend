import type { AdminTab, CrewForm, CrewTab, DrillForm, ShipForm, SetupTab, TaskForm } from "./ui-types";
import type { TaskStatus } from "./types";

export const adminTabs: readonly (AdminTab | SetupTab)[] = ["Dashboard", "Ships & Crew", "Maintenance", "Drills"];
export const crewTabs: readonly CrewTab[] = ["My Work"];
export const taskStatuses: readonly TaskStatus[] = ["Pending", "In Progress", "Completed"];

export const emptyTaskForm: TaskForm = {
  shipId: "",
  title: "",
  description: "",
  assignedCrewId: "",
  dueDate: ""
};

export const emptyDrillForm: DrillForm = {
  shipId: "",
  type: "",
  scheduledDate: "",
  assignedCrewIds: []
};

export const emptyShipForm: ShipForm = {
  name: "",
  imo: ""
};

export const emptyCrewForm: CrewForm = {
  name: "",
  role: "",
  shipId: ""
};

export const styles = {
  button: "rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800",
  secondaryButton: "rounded-xl bg-slate-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800",
  inactiveTab: "rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-800 ring-1 ring-slate-200",
  input: "min-w-44 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-700",
  label: "grid gap-1.5 text-sm font-bold text-slate-700",
  panel: "rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70"
} as const;
