import { useState } from "react";
import type { InnerTabDef } from "./InnerTabs";
import { InnerTabs } from "./InnerTabs";
import { styles } from "../constants";
import type { CrewMember, MaintenanceTask, SafetyDrill, Ship, TaskStatus } from "../types";
import type { EntityMap } from "../ui-types";
import { DrillList } from "./DrillList";
import { TaskTable } from "./TaskTable";

type CrewWorkTab = "maintenance" | "drills";

const crewWorkTabs: readonly InnerTabDef<CrewWorkTab>[] = [
  { id: "maintenance", label: "Maintenance", iconClass: "bi bi-wrench-adjustable" },
  { id: "drills", label: "Drills", iconClass: "bi bi-life-preserver" }
];

type CrewPanelProps = {
  currentCrewId: string;
  crewById: EntityMap<CrewMember>;
  crewDrills: SafetyDrill[];
  crewTasks: MaintenanceTask[];
  shipById: EntityMap<Ship>;
  onAttendance: (id: string) => void;
  onComplete: (id: string) => void;
  onTaskStatusChange: (id: string, status: TaskStatus, note?: string) => void;
};

export function CrewPanel({
  currentCrewId,
  crewById,
  crewDrills,
  crewTasks,
  shipById,
  onAttendance,
  onComplete,
  onTaskStatusChange
}: CrewPanelProps) {
  const [workTab, setWorkTab] = useState<CrewWorkTab>("maintenance");

  return (
    <section className={styles.panelCrew}>
      <div className={styles.pageHeadingRow}>
        <div className={styles.pageHeadingCluster}>
          <span className={styles.pageHeadingAccent} aria-hidden />
          <h2 className={styles.pageHeadingTitle}>My work</h2>
        </div>
      </div>

      <div className={`${styles.filterRibbon} mb-4`}>
        <InnerTabs embedded tabs={crewWorkTabs} value={workTab} onChange={setWorkTab} />
      </div>

      {workTab === "maintenance" ? (
        <TaskTable tasks={crewTasks} crewById={crewById} shipById={shipById} onStatus={onTaskStatusChange} />
      ) : (
        <DrillList
          drills={crewDrills}
          shipById={shipById}
          crewById={crewById}
          currentCrewId={currentCrewId}
          onAttendance={onAttendance}
          onComplete={onComplete}
        />
      )}
    </section>
  );
}
