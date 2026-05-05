import type { FormEvent } from "react";
import { styles, taskStatuses } from "../constants";
import type { CrewMember, MaintenanceTask, Ship, TaskStatus } from "../types";
import type { EntityMap, TaskForm } from "../ui-types";
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
  return (
    <section className={styles.panel}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold">Maintenance Management</h2>
        <select className={styles.input} value={selectedStatus} onChange={(event) => onStatusFilterChange(event.target.value)}>
          <option value="">All status</option>
          {taskStatuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <TaskFormView crew={crew} ships={ships} taskForm={taskForm} onChange={onTaskFormChange} onSubmit={onCreateTask} />
      <TaskTable tasks={tasks} crewById={crewById} shipById={shipById} onStatus={onTaskStatusChange} />
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
    <form className="mb-6 flex flex-wrap gap-3" onSubmit={handleSubmit}>
      <input className={styles.input} placeholder="Task title" value={taskForm.title} onChange={(event) => onChange({ ...taskForm, title: event.target.value })} required />
      <input className={styles.input} placeholder="Description" value={taskForm.description} onChange={(event) => onChange({ ...taskForm, description: event.target.value })} required />
      <select className={styles.input} value={taskForm.shipId} onChange={(event) => onChange({ ...taskForm, shipId: event.target.value })}>
        {ships.map((ship) => (
          <option key={ship.id} value={ship.id}>{ship.name}</option>
        ))}
      </select>
      <select className={styles.input} value={taskForm.assignedCrewId} onChange={(event) => onChange({ ...taskForm, assignedCrewId: event.target.value })}>
        {crew.map((member) => (
          <option key={member.id} value={member.id}>{member.name}</option>
        ))}
      </select>
      <input className={styles.input} type="date" value={taskForm.dueDate} onChange={(event) => onChange({ ...taskForm, dueDate: event.target.value })} required />
      <button className={styles.button} type="submit">Create Task</button>
    </form>
  );
}
