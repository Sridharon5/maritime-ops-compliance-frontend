import { useMemo, useState, type FormEvent } from "react";
import { styles, taskStatuses } from "../constants";
import type { CrewMember, MaintenanceTask, Ship, TaskStatus } from "../types";
import type { EntityMap, TaskForm } from "../ui-types";
import { Dialog } from "./Dialog";
import { ShipFilterSelect } from "./ShipFilterSelect";
import { TaskTable } from "./TaskTable";

type MaintenancePanelProps = {
  crew: CrewMember[];
  crewById: EntityMap<CrewMember>;
  selectedStatus: string;
  shipById: EntityMap<Ship>;
  ships: Ship[];
  taskForm: TaskForm;
  tasks: MaintenanceTask[];
  onCreateTask: () => Promise<void>;
  onStatusFilterChange: (status: string) => void;
  onTaskFormChange: (form: TaskForm) => void;
  onTaskStatusChange: (id: string, status: TaskStatus) => void;
};

export function MaintenancePanel({
  crew,
  crewById,
  selectedStatus,
  shipById,
  ships,
  taskForm,
  tasks,
  onCreateTask,
  onStatusFilterChange,
  onTaskFormChange,
  onTaskStatusChange
}: MaintenancePanelProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [shipFilterId, setShipFilterId] = useState("");

  const filteredTasks = useMemo(
    () => tasks.filter((task) => !shipFilterId || task.shipId === shipFilterId),
    [tasks, shipFilterId]
  );

  return (
    <section className={styles.panel}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-300">Operations</p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white">Maintenance Management</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Create, assign and track ship maintenance work.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ShipFilterSelect ships={ships} value={shipFilterId} onChange={setShipFilterId} />
          <select className={styles.input} value={selectedStatus} onChange={(event) => onStatusFilterChange(event.target.value)}>
            <option value="">All status</option>
            {taskStatuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <button className={styles.button} onClick={() => setIsDialogOpen(true)} type="button">Create Task</button>
        </div>
      </div>

      <TaskTable tasks={filteredTasks} crewById={crewById} shipById={shipById} onStatus={onTaskStatusChange} />

      <Dialog
        description="Assign work to a crew member and set the due date for compliance tracking."
        isOpen={isDialogOpen}
        title="Create Maintenance Task"
        onClose={() => setIsDialogOpen(false)}
      >
        <TaskFormView
          crew={crew}
          ships={ships}
          taskForm={taskForm}
          onChange={onTaskFormChange}
          onSubmit={async () => {
            await onCreateTask();
            setIsDialogOpen(false);
          }}
        />
      </Dialog>
    </section>
  );
}

function TaskFormView({
  crew,
  ships,
  taskForm,
  onChange,
  onSubmit
}: {
  crew: CrewMember[];
  ships: Ship[];
  taskForm: TaskForm;
  onChange: (form: TaskForm) => void;
  onSubmit: () => Promise<void>;
}) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit();
  };

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <label className={styles.label}>
        Task title
        <input className={styles.input} placeholder="Inspect fire pump" value={taskForm.title} onChange={(event) => onChange({ ...taskForm, title: event.target.value })} required />
      </label>
      <label className={styles.label}>
        Description
        <input className={styles.input} placeholder="Add maintenance details" value={taskForm.description} onChange={(event) => onChange({ ...taskForm, description: event.target.value })} required />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className={styles.label}>
          Ship
          <select className={styles.input} value={taskForm.shipId} onChange={(event) => onChange({ ...taskForm, shipId: event.target.value })}>
            {ships.map((ship) => (
              <option key={ship.id} value={ship.id}>{ship.name}</option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Assigned crew
          <select className={styles.input} value={taskForm.assignedCrewId} onChange={(event) => onChange({ ...taskForm, assignedCrewId: event.target.value })}>
            {crew.map((member) => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>
        </label>
      </div>
      <label className={styles.label}>
        Due date
        <input className={styles.input} type="date" value={taskForm.dueDate} onChange={(event) => onChange({ ...taskForm, dueDate: event.target.value })} required />
      </label>
      <div className="flex justify-end">
        <button className={styles.button} disabled={ships.length === 0 || crew.length === 0} type="submit">Create Task</button>
      </div>
    </form>
  );
}
