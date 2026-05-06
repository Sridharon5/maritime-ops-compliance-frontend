import type { AdminTab, CrewForm, CrewTab, DrillForm, ShipForm, TaskForm } from "./ui-types";
import type { TaskStatus } from "./types";

export const adminTabs: readonly AdminTab[] = ["Dashboard", "Ships", "Crew", "Maintenance", "Drills"];
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
  button: "rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-teal-900/10 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60",
  secondaryButton: "rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600",
  ghostButton: "rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-teal-300 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-teal-500 dark:hover:text-teal-300",
  inactiveTab: "rounded-2xl px-4 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white",
  input: "min-w-44 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500",
  label: "grid gap-1.5 text-sm font-bold text-slate-700 dark:text-slate-300",
  panel: "rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20",
  subtlePanel: "rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70"
} as const;
