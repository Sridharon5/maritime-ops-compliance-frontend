import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { CrewPanel } from "./components/CrewPanel";
import { Dashboard } from "./components/Dashboard";
import { DrillPanel } from "./components/DrillPanel";
import { Header } from "./components/Header";
import { MaintenancePanel } from "./components/MaintenancePanel";
import { CrewManagementPanel, ShipPanel } from "./components/ShipsCrewPanel";
import { adminTabs, crewTabs, styles } from "./constants";
import { useMaritimeData } from "./hooks/useMaritimeData";
import type { AppTab } from "./ui-types";

const tabDescriptions: Record<AppTab, string> = {
  Dashboard: "Compliance overview, risks and completion charts.",
  Ships: "Vessel records used across maintenance and drills.",
  Crew: "Crew profiles and ship assignments.",
  Maintenance: "Task assignments, due dates and completion status.",
  Drills: "Safety drill schedules, attendance and completion.",
  "My Work": "Crew view for assigned tasks and drills."
import { ShipsCrewPanel } from "./components/ShipsCrewPanel";
import { adminTabs, crewTabs } from "./constants";
import { useMaritimeData } from "./hooks/useMaritimeData";
import type { AppTab } from "./ui-types";

const TAB_ICONS: Record<string, ReactElement> = {
  Dashboard: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
      <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
    </svg>
  ),
  "Ships & Crew": (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
      <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
    </svg>
  ),
  Maintenance: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
      <path fillRule="evenodd" d="M12 6.75a5.25 5.25 0 0 1 6.775-5.025.75.75 0 0 1 .313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.641l3.318-3.319a.75.75 0 0 1 1.248.313 5.25 5.25 0 0 1-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 1 1 2.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.308A5.274 5.274 0 0 1 12 6.75Z" clipRule="evenodd" />
    </svg>
  ),
  Drills: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
      <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Z" clipRule="evenodd" />
    </svg>
  ),
  "My Work": (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
      <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clipRule="evenodd" />
      <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375ZM6 12a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V12Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 15a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V15Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 18a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V18Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
    </svg>
  )
};

export default function App() {
  const data = useMaritimeData();
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    return window.localStorage.getItem("theme") === "dark" ? "dark" : "light";
  });
  const visibleTabs: readonly AppTab[] = data.role === "admin" ? adminTabs : crewTabs;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white px-5 py-6 dark:border-slate-800 dark:bg-slate-900 lg:block">
        <div className="mb-8">
          <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-teal-600 text-lg font-black text-white">M</div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-300">Maritime Operations</p>
          <h1 className="mt-2 text-lg font-extrabold leading-tight text-slate-950 dark:text-white">Maintenance, Safety Drills & Compliance</h1>
        </div>

        <nav className="grid gap-2">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">Navigation</p>
          {visibleTabs.map((tab) => (
            <button
              key={tab}
              className={tab === data.activeTab ? `${styles.button} justify-start rounded-2xl text-left` : `${styles.inactiveTab} text-left`}
              onClick={() => data.actions.setActiveTab(tab)}
              type="button"
            >
              {tab}
            </button>
          ))}
        </nav>
      </aside>

      <section className="lg:pl-72">
        <Header
          role={data.role}
          theme={theme}
          onRoleChange={data.actions.setRole}
          onThemeToggle={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
        />

        <div className="border-b border-slate-200 bg-white px-5 py-3 dark:border-slate-800 dark:bg-slate-900 lg:hidden">
          <nav className="flex gap-2 overflow-x-auto">
            {visibleTabs.map((tab) => (
              <button
                key={tab}
                className={tab === data.activeTab ? styles.button : styles.inactiveTab}
                onClick={() => data.actions.setActiveTab(tab)}
                type="button"
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="px-5 py-6 sm:px-8">
          <div className="mb-6">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{tabDescriptions[data.activeTab]}</p>
          </div>

          {data.message && (
            <p className="mb-4 rounded-2xl border border-cyan-300 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-900 dark:border-cyan-800 dark:bg-cyan-950 dark:text-cyan-100">
              {data.message}
            </p>
          )}

          {data.role === "admin" && data.activeTab === "Dashboard" && (
            <Dashboard ships={data.ships} />
          )}

          {data.role === "admin" && data.activeTab === "Ships" && (
            <ShipPanel
              shipForm={data.shipForm}
              ships={data.ships}
              onCreateShip={data.actions.createShip}
              onShipFormChange={data.actions.setShipForm}
            />
          )}

          {data.role === "admin" && data.activeTab === "Crew" && (
            <CrewManagementPanel
              crew={data.crew}
              crewForm={data.crewForm}
              ships={data.ships}
              onCreateCrewMember={data.actions.createCrewMember}
              onCrewFormChange={data.actions.setCrewForm}
            />
          )}

          {data.role === "admin" && data.activeTab === "Maintenance" && (
            <MaintenancePanel
              crew={data.crew}
              crewById={data.crewById}
              selectedStatus={data.selectedStatus}
              shipById={data.shipById}
              ships={data.ships}
              taskForm={data.taskForm}
              tasks={data.tasks}
              onCreateTask={data.actions.createTask}
              onStatusFilterChange={data.actions.setSelectedStatus}
              onTaskFormChange={data.actions.setTaskForm}
              onTaskStatusChange={data.actions.updateTaskStatus}
            />
          )}

          {data.role === "admin" && data.activeTab === "Drills" && (
            <DrillPanel
              crew={data.crew}
              crewById={data.crewById}
              drillForm={data.drillForm}
              drills={data.drills}
              shipById={data.shipById}
              ships={data.ships}
              onAttendance={data.actions.markAttendance}
              onComplete={data.actions.completeDrill}
              onCreateDrill={data.actions.createDrill}
              onDrillFormChange={data.actions.setDrillForm}
            />
          )}

          {data.role === "crew" && data.activeTab === "My Work" && (
            <CrewPanel
              crew={data.crew}
              crewById={data.crewById}
              crewDrills={data.crewDrills}
              crewTasks={data.crewTasks}
              selectedCrewId={data.selectedCrewId}
              shipById={data.shipById}
              onAttendance={data.actions.markAttendance}
              onComplete={data.actions.completeDrill}
              onCrewChange={data.actions.setSelectedCrewId}
              onTaskStatusChange={data.actions.updateTaskStatus}
            />
          )}
        </div>
      </section>
    </main>
  );
}
