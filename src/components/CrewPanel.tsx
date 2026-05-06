import { styles } from "../constants";
import type { CrewMember, MaintenanceTask, SafetyDrill, Ship, TaskStatus } from "../types";
import type { EntityMap } from "../ui-types";
import { DrillList } from "./DrillList";
import { TaskTable } from "./TaskTable";

type CrewPanelProps = {
  crew: CrewMember[];
  crewById: EntityMap<CrewMember>;
  crewDrills: SafetyDrill[];
  crewTasks: MaintenanceTask[];
  selectedCrewId: string;
  shipById: EntityMap<Ship>;
  onAttendance: (id: string) => void;
  onComplete: (id: string) => void;
  onCrewChange: (crewId: string) => void;
  onTaskStatusChange: (id: string, status: TaskStatus) => void;
};

export function CrewPanel({
  crew,
  crewById,
  crewDrills,
  crewTasks,
  selectedCrewId,
  shipById,
  onAttendance,
  onComplete,
  onCrewChange,
  onTaskStatusChange
}: CrewPanelProps) {
  return (
    <section className={styles.panel}>
      <h2 className="mb-5 text-2xl font-extrabold text-slate-950 dark:text-white">My Work</h2>
      <label className={`${styles.label} mb-6 max-w-xs`}>
        Crew member
        <select className={styles.input} value={selectedCrewId} onChange={(event) => onCrewChange(event.target.value)}>
          {crew.map((member) => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </select>
      </label>

      <h3 className="mb-3 text-lg font-extrabold text-slate-950 dark:text-white">Assigned Maintenance</h3>
      <TaskTable tasks={crewTasks} crewById={crewById} shipById={shipById} onStatus={onTaskStatusChange} />

      <h3 className="mb-3 mt-8 text-lg font-extrabold text-slate-950 dark:text-white">Upcoming / Assigned Drills</h3>
      <DrillList drills={crewDrills} shipById={shipById} crewById={crewById} onAttendance={onAttendance} onComplete={onComplete} />
    </section>
  );
}
