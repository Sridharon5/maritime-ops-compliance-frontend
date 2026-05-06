import { useState } from "react";
import { maintenanceTableColumns } from "../config/tableLayouts";
import { styles, taskStatusChipClasses, taskStatuses } from "../constants";
import type { CrewMember, MaintenanceTask, Ship, TaskStatus } from "../types";
import type { EntityMap } from "../ui-types";
import { Dialog } from "./Dialog";

type TaskTableProps = {
  tasks: MaintenanceTask[];
  crewById: EntityMap<CrewMember>;
  shipById: EntityMap<Ship>;
  onStatus: (id: string, status: TaskStatus, note?: string) => void;
  startIndex?: number;
};

export function TaskTable({ tasks, crewById, shipById, onStatus, startIndex = 0 }: TaskTableProps) {
  const [editing, setEditing] = useState<MaintenanceTask | null>(null);
  const [draftStatus, setDraftStatus] = useState<TaskStatus>("Pending");
  const [draftNote, setDraftNote] = useState("");
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});

  const openEdit = (task: MaintenanceTask) => {
    setEditing(task);
    setDraftStatus(task.status);
    setDraftNote("");
  };

  const closeEdit = () => {
    setEditing(null);
    setDraftNote("");
  };

  const submitEdit = async () => {
    if (!editing) return;
    await onStatus(editing.id, draftStatus, draftNote.trim() || undefined);
    closeEdit();
  };

  const toggleNotes = (taskId: string) => {
    setExpandedNotes((current) => ({ ...current, [taskId]: !current[taskId] }));
  };

  const isOverdue = (dueDate: string) => {
    const day = dueDate.slice(0, 10);
    const today = new Date().toISOString().slice(0, 10);
    return Boolean(day) && day < today;
  };

  if (tasks.length === 0) {
    return <p className={styles.emptyState}>No maintenance tasks match the current view.</p>;
  }

  const col = maintenanceTableColumns;

  return (
    <>
      <div className={styles.tableSurround}>
        <table className="w-full table-fixed border-collapse text-left text-sm">
          <thead>
            <tr className={styles.tableHeadRow}>
              <th className={`p-3 text-left text-xs font-bold uppercase tracking-wide ${col.sNo}`}>S.No</th>
              <th className={`p-3 text-left text-xs font-bold uppercase tracking-wide ${col.task}`}>Task</th>
              <th className={`p-3 text-left text-xs font-bold uppercase tracking-wide ${col.ship}`}>Ship</th>
              <th className={`p-3 text-left text-xs font-bold uppercase tracking-wide ${col.crew}`}>Crew</th>
              <th className={`p-3 text-left text-xs font-bold uppercase tracking-wide ${col.due}`}>Due</th>
              <th className={`p-3 text-left text-xs font-bold uppercase tracking-wide ${col.status}`}>Status</th>
              <th className={`p-3 text-left text-xs font-bold uppercase tracking-wide ${col.notes}`}>Notes</th>
              <th className={`p-3 text-left text-xs font-bold uppercase tracking-wide ${col.actions}`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr className={`${index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd} align-top`} key={task.id}>
                <td className={`p-3 text-left font-semibold ${col.sNo}`}>{startIndex + index + 1}</td>
                <td className={`p-3 text-left ${col.task}`}>
                  <strong className="block break-words text-ink-heading">
                    {task.title}
                  </strong>
                  <span className="block break-words text-ink-body">{task.description}</span>
                </td>
                <td className={`p-3 text-left break-words ${col.ship}`}>{shipById[task.shipId]?.name ?? "Unknown"}</td>
                <td className={`p-3 text-left break-words ${col.crew}`}>{crewById[task.assignedCrewId]?.name ?? "Unassigned"}</td>
                <td className={`p-3 text-left break-words ${col.due}`}>{task.dueDate}</td>
                <td className={`p-3 text-left ${col.status}`}>
                  <span className={taskStatusChipClasses(task.status, task.status !== "Completed" && isOverdue(task.dueDate))}>
                    {task.status}
                    {task.status !== "Completed" && isOverdue(task.dueDate) ? " · Overdue" : ""}
                  </span>
                </td>
                <td className={`p-3 text-left ${col.notes}`}>
                  <button
                    className="w-full rounded-md px-2 py-1 text-left text-ink-body transition hover:bg-brand-50/80 hover:text-ink-heading dark:hover:bg-brand-50/10"
                    type="button"
                    onClick={() => toggleNotes(task.id)}
                    title={expandedNotes[task.id] ? "Collapse notes" : "Expand notes"}
                  >
                    <span className={expandedNotes[task.id] ? "block break-words" : "line-clamp-2 break-words"}>
                      {task.notes.join(", ") || "—"}
                    </span>
                  </button>
                </td>
                <td className={`p-3 text-left ${col.actions}`}>
                  <button className={`${styles.toolbarGhostButton} text-xs`} type="button" onClick={() => openEdit(task)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog description="Update status and add note." isOpen={Boolean(editing)} title="Update task" onClose={closeEdit}>
        {editing ? (
          <div className="grid gap-3">
            <p className="text-sm font-semibold text-ink-body">{editing.title}</p>
            <label className={styles.label}>
              Status
              <select className={styles.input} value={draftStatus} onChange={(event) => setDraftStatus(event.target.value as TaskStatus)}>
                {taskStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.label}>
              Note (optional)
              <textarea className={`${styles.input} min-h-20 resize-y`} value={draftNote} onChange={(event) => setDraftNote(event.target.value)} />
            </label>
            <div className="flex justify-end gap-2">
              <button className={styles.ghostButton} type="button" onClick={closeEdit}>Cancel</button>
              <button className={styles.button} type="button" onClick={() => void submitEdit()}>Save</button>
            </div>
          </div>
        ) : null}
      </Dialog>
    </>
  );
}
