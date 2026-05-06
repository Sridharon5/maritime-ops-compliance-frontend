import { useEffect, useState } from "react";
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
