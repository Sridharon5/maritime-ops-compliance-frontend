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
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
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
            <tr className="border-b border-slate-100 align-top" key={task.id}>
              <td className="p-3">
                <strong className="block text-slate-950">{task.title}</strong>
                <span className="text-slate-600">{task.description}</span>
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
