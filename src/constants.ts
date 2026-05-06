import type { AdminTab, CrewForm, CrewTab, DrillForm, ShipForm, TaskForm } from "./ui-types";
import type { TaskStatus } from "./types";

export const tabNavIcons: Record<AdminTab | CrewTab, string> = {
  Dashboard: "bi bi-speedometer2",
  Ships: "bi bi-water",
  Crew: "bi bi-people-fill",
  Maintenance: "bi bi-wrench-adjustable",
  Drills: "bi bi-life-preserver",
  "My Work": "bi bi-clipboard-check"
};

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

/** Dashboard metric card left accent (enterprise maritime spec). */
export type MetricCardAccent = "neutral" | "maintenance" | "drills" | "compliance" | "atRisk" | "risk";

export const metricCardAccentClass: Record<MetricCardAccent, string> = {
  neutral: "border-l-4 border-l-line-strong",
  maintenance: "border-l-4 border-l-primary-600",
  drills: "border-l-4 border-l-secondary-600",
  compliance: "border-l-4 border-l-success",
  atRisk: "border-l-4 border-l-partially-compliant",
  risk: "border-l-4 border-l-non-compliant"
};

/** Compliance % display — success / warning / danger thresholds. */
export function complianceScoreTextClass(percent: number): string {
  if (percent >= 90) return "text-success";
  if (percent >= 70) return "text-partially-compliant";
  return "text-non-compliant";
}

/** Drill row status pill — teal schedule vs green completed. */
export function drillStatusBadgeClass(status: "Scheduled" | "Completed"): string {
  const shell =
    "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ring-1 transition-[var(--transition-fast)]";
  if (status === "Completed") return `${shell} bg-success-soft text-success-fg ring-success/35`;
  return `${shell} bg-secondary-100 text-secondary-700 ring-secondary-500/25`;
}

/** Maintenance task status chips (semantic colors + text — not color-only). */
export function taskStatusChipClasses(status: TaskStatus, overdue: boolean): string {
  const base = "inline-flex rounded-[var(--radius-sm)] border px-2 py-1 text-xs font-bold";
  if (overdue) return `${base} border-danger/30 bg-danger-light text-danger-dark`;
  switch (status) {
    case "Pending":
      return `${base} border-warning/35 bg-warning-light text-warning-dark`;
    case "In Progress":
      return `${base} border-info/35 bg-info-light text-info-dark`;
    case "Completed":
      return `${base} border-success/35 bg-success-soft text-success-fg`;
    default:
      return `${base} border-line-default bg-canvas-muted text-ink-body`;
  }
}

/**
 * Shared UI classes — all colors resolve via theme/palette.css → Tailwind @theme.
 * Radius / motion use CSS vars from palette.css (:root).
 */
/** Hover “lift” + click press-in — use on buttons / tabs (GPU-friendly). */
const liftSm =
  "transform-gpu transition-[transform,box-shadow,background-color,border-color,color] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98] active:shadow-md motion-reduce:transform-none motion-reduce:hover:translate-y-0";

const liftIcon =
  "transform-gpu transition-[transform,box-shadow,border-color,color] duration-200 ease-out hover:-translate-y-px hover:shadow-md active:translate-y-0 active:scale-[0.96] active:shadow-sm motion-reduce:transform-none motion-reduce:hover:translate-y-0";

const disabledLiftReset =
  "disabled:hover:-translate-y-0 disabled:hover:shadow-none disabled:active:scale-100 disabled:active:shadow-none";

/** Dashboard / analytics panels — stronger hover lift than toolbar chips */
const liftMd =
  "transform-gpu transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-950/14 active:translate-y-0 active:scale-[0.99] motion-reduce:transform-none motion-reduce:hover:translate-y-0 dark:hover:shadow-black/45";

export const styles = {
  /** Top bar & mobile nav — maritime gradient, ties to sidebar navy */
  headerBar:
    "border-b border-white/[0.14] bg-[linear-gradient(105deg,var(--palette-header-bg-start)_0%,var(--palette-header-bg-mid)_45%,var(--palette-header-bg-end)_100%)] shadow-[0_10px_32px_-12px_rgba(11,31,51,0.58)] backdrop-blur-md dark:border-white/[0.12] dark:shadow-[0_14px_44px_-14px_rgba(0,0,0,0.72)]",

  headerBarTitle:
    "text-[rgb(244_247_250)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]",

  /** Native selects on dark header — frosted light chips; options own grey text (avoid white-on-white in OS dropdown) */
  headerToolbarControl:
    "min-w-32 rounded-[var(--radius-sm)] border border-white/28 bg-white/14 px-2 py-1.5 text-sm font-semibold text-white shadow-md shadow-black/25 outline-none backdrop-blur-md transition-[var(--transition-fast),box-shadow,border-color,background-color] hover:border-white/45 hover:bg-white/22 hover:shadow-lg focus:border-brand-300 focus:shadow-lg focus:ring-2 focus:ring-brand-400/40 [&_option]:bg-white [&_option]:font-semibold [&_option]:text-gray-700 dark:[&_option]:bg-brand-950 dark:[&_option]:text-gray-200",

  headerToolbarGhostButton:
    `rounded-[var(--radius-sm)] border border-white/28 bg-white/12 px-2.5 py-1.5 text-sm font-bold text-white shadow-md shadow-black/20 backdrop-blur-md ${liftSm} hover:border-white/45 hover:bg-white/22 hover:text-white hover:shadow-xl hover:shadow-black/35`,

  tableHeadRow:
    "border-b border-line-default bg-table-header-bg text-table-header-fg transition-colors duration-[var(--transition-fast)]",
  tableRowEven:
    "border-b border-line-default bg-table-row-even transition-colors duration-[var(--transition-fast)] hover:bg-table-row-hover",
  tableRowOdd:
    "border-b border-line-default bg-table-row-odd transition-colors duration-[var(--transition-fast)] hover:bg-table-row-hover",

  button:
    `rounded-[var(--radius-sm)] bg-brand-600 px-2.5 py-1.5 text-sm font-bold text-white shadow-md shadow-brand-900/20 ${liftSm} hover:bg-brand-700 hover:shadow-brand-900/35 disabled:cursor-not-allowed disabled:opacity-60 ${disabledLiftReset} disabled:shadow-sm`,
  secondaryButton:
    `rounded-[var(--radius-sm)] bg-secondary-600 px-2.5 py-1.5 text-sm font-bold text-white shadow-md shadow-secondary-700/30 ${liftSm} hover:bg-btn-secondary-hover hover:shadow-secondary-700/45 ${disabledLiftReset} disabled:opacity-60`,
  ghostButton:
    `rounded-[var(--radius-sm)] border border-line-default bg-canvas-elevated px-2.5 py-1.5 text-sm font-bold text-ink-body shadow-sm ${liftSm} hover:border-brand-500 hover:bg-brand-50/60 hover:text-brand-800 hover:shadow-brand-900/10 dark:hover:border-brand-400 dark:hover:bg-brand-950/30 dark:hover:text-brand-200 ${disabledLiftReset}`,
  toolbarPrimaryButton:
    `rounded-[var(--radius-sm)] bg-brand-600 px-2.5 py-1.5 text-sm font-bold text-white shadow-md shadow-brand-900/20 ${liftSm} hover:bg-brand-700 hover:shadow-brand-900/35 disabled:cursor-not-allowed disabled:opacity-60 ${disabledLiftReset} disabled:shadow-sm`,
  toolbarGhostButton:
    `rounded-[var(--radius-sm)] border border-line-default bg-white/70 px-2.5 py-1.5 text-sm font-bold text-ink-body shadow-sm backdrop-blur-sm ${liftSm} hover:border-brand-500 hover:bg-brand-50/80 hover:text-brand-900 hover:shadow-brand-900/10 dark:border-line-strong dark:bg-white/[0.06] dark:hover:border-brand-400 dark:hover:bg-brand-950/40 dark:hover:text-brand-100 ${disabledLiftReset}`,
  toolbarIconButton:
    `inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] border border-line-default bg-white/70 text-ink-body shadow-sm backdrop-blur-sm ${liftIcon} hover:border-brand-500 hover:bg-brand-50/70 hover:text-brand-800 disabled:cursor-not-allowed disabled:opacity-40 dark:border-line-strong dark:bg-white/[0.06] dark:hover:border-brand-400 dark:hover:text-brand-200 ${disabledLiftReset}`,
  inactiveTab:
    `rounded-[var(--radius-sm)] bg-canvas-muted px-2.5 py-1.5 text-sm font-bold text-ink-muted shadow-sm ${liftSm} hover:bg-line-subtle hover:text-ink-heading hover:shadow-md`,

  /** Dark navy sidebar — inset from rail so active pill does not stack on border-r */
  sidebarNavActive:
    "flex w-full min-h-[2.25rem] items-center gap-2 rounded-[var(--radius-md)] border border-white/10 bg-sidebar-active-bg px-2.5 py-1.5 text-left text-sm font-bold text-sidebar-fg shadow-md shadow-black/20 transition-[var(--transition-fast)]",
  sidebarNavInactive:
    "flex w-full min-h-[2.25rem] items-center gap-2 rounded-[var(--radius-md)] border border-transparent px-2.5 py-1.5 text-left text-sm font-bold text-sidebar-fg/85 transition-[var(--transition-fast)] hover:border-white/[0.06] hover:bg-sidebar-hover hover:text-sidebar-fg",

  /** Dashboard metric / chart / risk — hover lift only here (not on table shells) */
  dashboardPanel: `rounded-[var(--radius-lg)] border border-line-default bg-canvas-elevated p-5 shadow-lg shadow-brand-950/[0.06] ring-1 ring-brand-900/[0.05] transition-[transform,box-shadow,border-color] duration-200 ease-out dark:shadow-black/35 dark:ring-white/[0.05] ${liftMd}`,

  /** Light strip (mobile) — same hierarchy as sidebar without navy chrome */
  sidebarNavActiveMobile:
    `flex w-full min-h-[2.25rem] items-center gap-2 rounded-[var(--radius-md)] border border-brand-600 bg-brand-600 px-2.5 py-1.5 text-left text-sm font-bold text-white shadow-md shadow-brand-900/25 ${liftSm} hover:bg-brand-700 hover:shadow-brand-900/35`,
  sidebarNavInactiveMobile:
    `flex w-full min-h-[2.25rem] items-center gap-2 rounded-[var(--radius-md)] border border-transparent bg-canvas-muted px-2.5 py-1.5 text-left text-sm font-bold text-ink-body shadow-sm ${liftSm} hover:bg-line-subtle hover:text-ink-heading hover:shadow-md`,

  /** Maintenance / brand-accent filter tabs */
  innerTabActiveBrand:
    `inline-flex min-h-[2.25rem] items-center rounded-[var(--radius-md)] border border-brand-600 bg-brand-600 px-3 py-1.5 text-sm font-bold text-white shadow-md shadow-brand-900/25 ${liftSm} hover:border-brand-700 hover:bg-brand-700 hover:shadow-lg dark:border-brand-500 dark:bg-brand-500 dark:hover:border-brand-600 dark:hover:bg-brand-600`,
  innerTabInactiveBrand:
    `inline-flex min-h-[2.25rem] items-center rounded-[var(--radius-md)] border border-line-default bg-white/95 px-3 py-1.5 text-sm font-bold text-ink-body shadow-sm ${liftSm} hover:border-brand-400/70 hover:bg-brand-50 hover:text-ink-heading hover:shadow-md dark:border-line-strong dark:bg-white/[0.06] dark:text-ink-body dark:hover:border-brand-500/45 dark:hover:bg-brand-950/35 dark:hover:text-brand-100`,

  /** Drills — teal secondary accent for active tab */
  innerTabActiveSecondary:
    `inline-flex min-h-[2.25rem] items-center rounded-[var(--radius-md)] border border-secondary-600 bg-secondary-600 px-3 py-1.5 text-sm font-bold text-white shadow-md shadow-secondary-700/30 ${liftSm} hover:border-secondary-700 hover:bg-secondary-700 hover:shadow-lg dark:border-secondary-500 dark:bg-secondary-500 dark:hover:border-secondary-600 dark:hover:bg-secondary-600`,
  innerTabInactiveSecondary:
    `inline-flex min-h-[2.25rem] items-center rounded-[var(--radius-md)] border border-line-default bg-white/95 px-3 py-1.5 text-sm font-bold text-ink-body shadow-sm ${liftSm} hover:border-secondary-500/55 hover:bg-secondary-100 hover:text-ink-heading hover:shadow-md dark:border-line-strong dark:bg-white/[0.06] dark:text-ink-body dark:hover:border-secondary-500/50 dark:hover:bg-secondary-700/25 dark:hover:text-secondary-100`,

  /** Match Dashboard / navbar polish — accent bar + ribbon filters */
  pageHeadingRow:
    "mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-line-strong pb-4 dark:border-line-default",
  pageHeadingAccent:
    "h-10 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-brand-600 via-brand-500 to-secondary-600 shadow-md shadow-brand-900/15",
  pageHeadingTitle: "text-xl font-extrabold tracking-tight text-ink-heading",
  pageHeadingCluster: "flex min-w-0 items-center gap-3",

  filterRibbon:
    "rounded-[var(--radius-lg)] border border-line-default bg-gradient-to-br from-brand-50/95 via-canvas-elevated to-secondary-50/50 p-3 shadow-inner shadow-brand-950/[0.06] dark:from-brand-950/40 dark:via-canvas-elevated dark:to-secondary-950/25 dark:shadow-black/25",

  tableSurround:
    "overflow-x-hidden rounded-[var(--radius-lg)] border border-line-default bg-canvas-elevated shadow-lg shadow-brand-950/[0.07] ring-1 ring-brand-900/[0.06] dark:border-line-strong dark:shadow-black/40 dark:ring-white/[0.06]",

  drillCardBase:
    "rounded-[var(--radius-lg)] border border-line-default border-l-4 bg-canvas-elevated p-5 shadow-md shadow-brand-950/[0.06] ring-1 ring-brand-900/[0.04] transition-[var(--transition-normal)] hover:border-brand-300/45 hover:shadow-lg hover:shadow-brand-950/[0.1] hover:ring-brand-400/12 dark:border-line-strong dark:hover:border-brand-600/35",
  drillAccentScheduled: "border-l-secondary-600",
  drillAccentCompleted: "border-l-success",

  emptyState:
    "rounded-[var(--radius-lg)] border border-dashed border-brand-400/40 bg-gradient-to-br from-canvas-muted via-canvas-elevated to-brand-50/50 px-4 py-10 text-center text-sm font-semibold text-ink-muted shadow-inner dark:border-brand-600/35 dark:from-canvas-muted dark:via-canvas-elevated dark:to-brand-950/25",

  flashNotice:
    "rounded-[var(--radius-lg)] border border-notice-border bg-gradient-to-r from-notice-soft via-canvas-elevated to-brand-50/35 px-4 py-3 text-sm font-semibold text-notice-fg shadow-md shadow-brand-900/[0.06] dark:to-brand-950/30",

  paginationBar:
    "mt-4 rounded-[var(--radius-lg)] border border-line-default bg-gradient-to-r from-canvas-muted/95 via-brand-50/35 to-secondary-50/40 px-4 py-3 shadow-sm ring-1 ring-brand-900/[0.04] dark:border-line-strong dark:bg-gradient-to-r dark:from-canvas-muted dark:via-canvas-elevated dark:to-canvas-muted dark:shadow-inner dark:shadow-black/40 dark:ring-white/[0.08]",

  /** Page prev/next cluster — dark surfaces only (no stray light grays) */
  paginationPagerChrome:
    "flex items-center gap-1 rounded-[var(--radius-sm)] border border-line-default bg-canvas-elevated p-0.5 shadow-sm dark:border-white/[0.12] dark:bg-black/40 dark:shadow-inner dark:shadow-black/50",

  paginationNavButton:
    "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-line-default bg-canvas-muted text-ink-heading shadow-sm transition-[background-color,border-color,color,opacity] duration-200 hover:border-brand-500 hover:bg-brand-500/12 hover:text-brand-800 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line-default disabled:hover:bg-canvas-muted disabled:hover:text-ink-heading dark:border-white/15 dark:bg-white/[0.08] dark:text-white dark:hover:border-brand-400 dark:hover:bg-brand-500/25 dark:hover:text-white dark:disabled:opacity-30 dark:disabled:hover:bg-white/[0.08] dark:disabled:hover:border-white/12",

  input:
    "min-w-44 rounded-[var(--radius-sm)] border border-line-default bg-white/90 px-2.5 py-1.5 text-sm text-ink-heading shadow-sm outline-none backdrop-blur-sm transition-[var(--transition-fast),box-shadow,border-color] placeholder:text-ink-faint hover:border-brand-300/80 focus:border-brand-600 focus:shadow-md focus:ring-2 focus:ring-brand-500/25 dark:bg-white/[0.07]",
  toolbarControl:
    "min-w-32 rounded-[var(--radius-sm)] border border-line-default bg-white/90 px-2 py-1.5 text-sm font-semibold text-ink-heading shadow-sm outline-none backdrop-blur-sm transition-[var(--transition-fast),box-shadow,border-color] hover:border-brand-300/80 focus:border-brand-600 focus:shadow-md focus:ring-2 focus:ring-brand-500/25 dark:bg-white/[0.07]",
  label: "grid gap-1 text-sm font-bold text-ink-body",

  /** Table/list page shell — static chrome (no hover lift) */
  panel:
    "rounded-[var(--radius-lg)] border border-line-default bg-canvas-elevated p-5 shadow-lg shadow-brand-950/[0.06] ring-1 ring-brand-900/[0.05] transition-colors duration-[var(--transition-fast)] dark:shadow-black/35 dark:ring-white/[0.05]",
  /** Crew — airy teal highlight */
  panelCrew:
    "rounded-[var(--radius-lg)] border border-secondary-400/25 bg-canvas-elevated p-5 shadow-lg shadow-secondary-900/[0.05] ring-1 ring-secondary-500/15 transition-[var(--transition-fast)] dark:border-secondary-500/30 dark:shadow-black/30 dark:ring-secondary-400/10",
  subtlePanel: "rounded-[var(--radius-md)] border border-line-default bg-canvas-muted p-3 shadow-sm ring-1 ring-brand-900/[0.03]",
  tableWrap:
    "overflow-x-auto rounded-[var(--radius-md)] border border-line-default bg-canvas-elevated/80 shadow-sm ring-1 ring-brand-900/[0.04] dark:border-line-strong dark:bg-transparent dark:ring-white/[0.05]"
} as const;
