import { styles } from "../constants";
import type { CrewMember, SafetyDrill, Ship } from "../types";
import type { EntityMap } from "../ui-types";
import { formatCrewNames } from "../utils/collections";

type DrillListProps = {
  drills: SafetyDrill[];
  shipById: EntityMap<Ship>;
  crewById: EntityMap<CrewMember>;
  onAttendance: (id: string) => void;
  onComplete: (id: string) => void;
};

export function DrillList({ drills, shipById, crewById, onAttendance, onComplete }: DrillListProps) {
  if (drills.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-400">
        No drills match the current view.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {drills.map((drill) => (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/70" key={drill.id}>
          <h3 className="text-lg font-extrabold text-slate-950 dark:text-white">{drill.type}</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {shipById[drill.shipId]?.name ?? "Unknown ship"} | {drill.scheduledDate} | {drill.status}
          </p>
          <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">Assigned: {formatCrewNames(drill.assignedCrewIds, crewById)}</p>
          <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
            Attendance: {drill.attendanceCrewIds.length}/{drill.assignedCrewIds.length}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className={styles.button} onClick={() => onAttendance(drill.id)} type="button">Mark Attendance</button>
            <button className={styles.secondaryButton} onClick={() => onComplete(drill.id)} type="button">Submit Completion</button>
          </div>
        </article>
      ))}
    </div>
  );
}
