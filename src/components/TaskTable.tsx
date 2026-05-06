import { styles, taskStatuses } from "../constants";
import type { CrewMember, MaintenanceTask, Ship, TaskStatus } from "../types";
import type { EntityMap } from "../ui-types";

type TaskTableProps = {
  tasks: MaintenanceTask[];
  crewById: EntityMap<CrewMember>;
  shipById: EntityMap<Ship>;
  onStatus: (id: string, status: TaskStatus) => void;
};

export function TaskTable({ tasks, crewById, shipById, onStatus }: TaskTableProps) {
  if (tasks.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-400">
        No maintenance tasks match the current view.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <th className="p-3">Task</th>
            <th className="p-3">Ship</th>
            <th className="p-3">Crew</th>
            <th className="p-3">Due</th>
            <th className="p-3">Status</th>
            <th className="p-3">Notes</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr className="border-b border-slate-100 align-top dark:border-slate-800" key={task.id}>
              <td className="p-3">
                <strong className="block text-slate-950 dark:text-white">{task.title}</strong>
                <span className="text-slate-600 dark:text-slate-400">{task.description}</span>
              </td>
              <td className="p-3">{shipById[task.shipId]?.name ?? "Unknown"}</td>
              <td className="p-3">{crewById[task.assignedCrewId]?.name ?? "Unassigned"}</td>
              <td className="p-3">{task.dueDate}</td>
              <td className="p-3">
                <select className={styles.input} value={task.status} onChange={(event) => onStatus(task.id, event.target.value as TaskStatus)}>
                  {taskStatuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </td>
              <td className="p-3">{task.notes.join(", ") || "No notes"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
