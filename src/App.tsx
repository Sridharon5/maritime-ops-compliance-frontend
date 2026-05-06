import { useEffect, useState } from "react";
import { CrewPanel } from "./components/CrewPanel";
import { Dashboard } from "./components/Dashboard";
import { DrillPanel } from "./components/DrillPanel";
import { Header } from "./components/Header";
import { SidebarNavbar } from "./components/SidebarNavbar";
import { MaintenancePanel } from "./components/MaintenancePanel";
import { CrewManagementPanel, ShipPanel } from "./components/ShipsCrewPanel";
import { adminTabs, crewTabs, styles, tabNavIcons } from "./constants";
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
  const sidebarProfileRole = data.role === "admin" ? "Admin" : "Crew";
  const sidebarProfileName = data.role === "admin" ? "Admin" : data.crewById[data.selectedCrewId]?.name ?? "Crew Member";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <main className="min-h-screen bg-canvas-body text-ink-heading">
      <SidebarNavbar
        activeTab={data.activeTab}
        profileName={sidebarProfileName}
        profileRole={sidebarProfileRole}
        visibleTabs={visibleTabs}
        onTabChange={data.actions.setActiveTab}
      />

      <section className="lg:pl-[var(--layout-sidebar-width)]">
        <Header
          crew={data.crew}
          role={data.role}
          selectedCrewId={data.selectedCrewId}
          theme={theme}
          onCrewChange={data.actions.setSelectedCrewId}
          onRoleChange={data.actions.setRole}
          onThemeToggle={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
        />

        <div className={`px-4 py-2 lg:hidden ${styles.headerBar}`}>
          <nav className="flex gap-1.5 overflow-x-auto pb-0.5" aria-label="Primary">
            {visibleTabs.map((tab) => (
              <button
                key={tab}
                className={tab === data.activeTab ? styles.sidebarNavActiveMobile : styles.sidebarNavInactiveMobile}
                onClick={() => data.actions.setActiveTab(tab)}
                type="button"
              >
                <i className={`${tabNavIcons[tab]} shrink-0 text-base leading-none`} aria-hidden />
                <span className="whitespace-nowrap">{tab}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="px-5 py-6 sm:px-8">
          <p className="sr-only">{tabDescriptions[data.activeTab]}</p>

          {data.message && (
            <p className={`${styles.flashNotice} mb-4`}>
              {data.message}
            </p>
          )}

          {data.role === "admin" && data.activeTab === "Dashboard" && <Dashboard ships={data.ships} />}

          {data.role === "admin" && data.activeTab === "Ships" && (
            <ShipPanel
              shipForm={data.shipForm}
              shipRows={data.shipRows}
              ships={data.ships}
              total={data.shipTotal}
              page={data.shipPage}
              pageSize={data.shipPageSize}
              onCreateShip={data.actions.createShip}
              onShipFormChange={data.actions.setShipForm}
              onPageChange={data.actions.setShipPage}
              onPageSizeChange={data.actions.setShipPageSize}
            />
          )}

          {data.role === "admin" && data.activeTab === "Crew" && (
            <CrewManagementPanel
              crewForm={data.crewForm}
              crewRows={data.crewRows}
              page={data.crewPage}
              pageSize={data.crewPageSize}
              shipFilterId={data.crewShipId}
              ships={data.ships}
              total={data.crewTotal}
              onCreateCrewMember={data.actions.createCrewMember}
              onCrewFormChange={data.actions.setCrewForm}
              onPageChange={data.actions.setCrewPage}
              onPageSizeChange={data.actions.setCrewPageSize}
              onShipFilterChange={data.actions.setCrewShipId}
            />
          )}

          {data.role === "admin" && data.activeTab === "Maintenance" && (
            <MaintenancePanel
              crew={data.crew}
              crewById={data.crewById}
              dueFrom={data.maintenanceDueFrom}
              dueTo={data.maintenanceDueTo}
              page={data.maintenancePage}
              pageSize={data.maintenancePageSize}
              selectedStatus={data.selectedStatus}
              shipById={data.shipById}
              shipFilterId={data.maintenanceShipId}
              ships={data.ships}
              taskForm={data.taskForm}
              tasks={data.tasks}
              total={data.taskTotal}
              onCreateTask={data.actions.createTask}
              onDueFromChange={data.actions.setMaintenanceDueFrom}
              onDueToChange={data.actions.setMaintenanceDueTo}
              onPageChange={data.actions.setMaintenancePage}
              onPageSizeChange={data.actions.setMaintenancePageSize}
              onShipFilterChange={data.actions.setMaintenanceShipId}
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
              page={data.drillPage}
              pageSize={data.drillPageSize}
              scheduledFrom={data.drillScheduledFrom}
              scheduledTo={data.drillScheduledTo}
              selectedDrillStatus={data.selectedDrillStatus}
              shipById={data.shipById}
              shipFilterId={data.drillShipId}
              ships={data.ships}
              total={data.drillTotal}
              onCreateDrill={data.actions.createDrill}
              onDrillFormChange={data.actions.setDrillForm}
              onDrillStatusFilterChange={data.actions.setSelectedDrillStatus}
              onPageChange={data.actions.setDrillPage}
              onPageSizeChange={data.actions.setDrillPageSize}
              onScheduledFromChange={data.actions.setDrillScheduledFrom}
              onScheduledToChange={data.actions.setDrillScheduledTo}
              onShipFilterChange={data.actions.setDrillShipId}
            />
          )}

          {data.role === "crew" && data.activeTab === "My Work" && (
            <CrewPanel
              currentCrewId={data.selectedCrewId}
              crewById={data.crewById}
              crewDrills={data.crewDrills}
              crewTasks={data.crewTasks}
              shipById={data.shipById}
              onAttendance={data.actions.markAttendance}
              onComplete={data.actions.completeDrill}
              onTaskStatusChange={data.actions.updateTaskStatus}
            />
          )}
        </div>
      </section>
    </main>
  );
}
