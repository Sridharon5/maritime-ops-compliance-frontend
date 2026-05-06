import { drillStatusBadgeClass, styles } from "../constants";
import type { CrewMember, SafetyDrill, Ship } from "../types";
import type { EntityMap } from "../ui-types";
import { formatCrewNames } from "../utils/collections";

type DrillListProps = {
  drills: SafetyDrill[];
  shipById: EntityMap<Ship>;
  crewById: EntityMap<CrewMember>;
  currentCrewId?: string;
  onAttendance?: (id: string) => void;
  onComplete?: (id: string) => void;
};

export function DrillList({ drills, shipById, crewById, currentCrewId, onAttendance, onComplete }: DrillListProps) {
  if (drills.length === 0) {
    return <p className={styles.emptyState}>No drills match the current view.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {drills.map((drill) => {
        const accent = drill.status === "Completed" ? styles.drillAccentCompleted : styles.drillAccentScheduled;
        const shipName = shipById[drill.shipId]?.name ?? "Unknown ship";
        return (
          <article className={`${styles.drillCardBase} ${accent}`} key={drill.id}>
            <h3 className="text-lg font-extrabold text-ink-heading">{drill.type}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-900 ring-1 ring-brand-200/80 dark:bg-brand-950/45 dark:text-brand-100 dark:ring-brand-700/45">
                {shipName}
              </span>
              <span className="rounded-full bg-canvas-muted px-2.5 py-0.5 text-xs font-semibold text-ink-body ring-1 ring-line-default dark:bg-canvas-row dark:ring-line-strong">
                {drill.scheduledDate}
              </span>
            </div>
            <p className="mt-3 text-sm text-ink-body">Assigned: {formatCrewNames(drill.assignedCrewIds, crewById)}</p>
            <p className="mt-1 text-sm font-bold text-ink-heading">
              Attendance: {drill.attendanceCrewIds.length}/{drill.assignedCrewIds.length}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className={drillStatusBadgeClass(drill.status)}>{drill.status}</span>
              {drill.status === "Scheduled" && onAttendance && onComplete ? (
                <>
                  {(!currentCrewId || !drill.attendanceCrewIds.includes(currentCrewId)) && (
                    <button className={styles.button} onClick={() => onAttendance(drill.id)} type="button">Mark attendance</button>
                  )}
                  {drill.attendanceCrewIds.length >= drill.assignedCrewIds.length && (
                    <button className={styles.secondaryButton} onClick={() => onComplete(drill.id)} type="button">Submit completion</button>
                  )}
                </>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
