import { CrewPanel } from "./components/CrewPanel";
import { Dashboard } from "./components/Dashboard";
import { DrillPanel } from "./components/DrillPanel";
import { Header } from "./components/Header";
import { MaintenancePanel } from "./components/MaintenancePanel";
import { ShipsCrewPanel } from "./components/ShipsCrewPanel";
import { adminTabs, crewTabs, styles } from "./constants";
import { useMaritimeData } from "./hooks/useMaritimeData";
import type { AppTab } from "./ui-types";

export default function App() {
  const data = useMaritimeData();
  const visibleTabs: readonly AppTab[] = data.role === "admin" ? adminTabs : crewTabs;

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
      <Header
        role={data.role}
        ships={data.ships}
        selectedShipId={data.selectedShipId}
        onRoleChange={data.actions.setRole}
        onShipChange={data.actions.setSelectedShipId}
      />

      <nav className="my-6 flex flex-wrap gap-2">
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

      {data.message && (
        <p className="mb-4 rounded-2xl border border-cyan-300 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-900">
          {data.message}
        </p>
      )}

      {data.role === "admin" && data.activeTab === "Dashboard" && data.compliance && (
        <Dashboard compliance={data.compliance} />
      )}

      {data.role === "admin" && data.activeTab === "Ships & Crew" && (
        <ShipsCrewPanel
          crew={data.crew}
          crewForm={data.crewForm}
          shipForm={data.shipForm}
          ships={data.ships}
          onCreateCrewMember={data.actions.createCrewMember}
          onCreateShip={data.actions.createShip}
          onCrewFormChange={data.actions.setCrewForm}
          onShipFormChange={data.actions.setShipForm}
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
    </main>
  );
}
