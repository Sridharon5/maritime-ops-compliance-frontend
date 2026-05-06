import type { InnerTabDef } from "./InnerTabs";
import { InnerTabs } from "./InnerTabs";
import { Pagination } from "./Pagination";
import { styles } from "../constants";
import type { CrewMember, MaintenanceTask, Ship, TaskStatus } from "../types";
import type { EntityMap, TaskForm } from "../ui-types";
import { Dialog } from "./Dialog";
import { ShipFilterSelect } from "./ShipFilterSelect";
import { TaskTable } from "./TaskTable";
import { useState, type FormEvent } from "react";

type MaintenanceStatusTab = "" | TaskStatus;

const maintenanceStatusTabs: readonly InnerTabDef<MaintenanceStatusTab>[] = [
  { id: "", label: "All" },
  { id: "Pending", label: "Pending" },
  { id: "In Progress", label: "In progress" },
  { id: "Completed", label: "Completed" }
];

type MaintenancePanelProps = {
  crew: CrewMember[];
  crewById: EntityMap<CrewMember>;
  dueFrom: string;
  dueTo: string;
  page: number;
  pageSize: number;
  selectedStatus: string;
  shipById: EntityMap<Ship>;
  shipFilterId: string;
  ships: Ship[];
  taskForm: TaskForm;
  tasks: MaintenanceTask[];
  total: number;
  onCreateTask: () => Promise<void>;
  onDueFromChange: (value: string) => void;
  onDueToChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onShipFilterChange: (shipId: string) => void;
  onStatusFilterChange: (status: string) => void;
  onTaskFormChange: (form: TaskForm) => void;
  onTaskStatusChange: (id: string, status: TaskStatus, note?: string) => void;
};

export function MaintenancePanel({
  crew,
  crewById,
  dueFrom,
  dueTo,
  page,
  pageSize,
  selectedStatus,
  shipById,
  shipFilterId,
  ships,
  taskForm,
  tasks,
  total,
  onCreateTask,
  onDueFromChange,
  onDueToChange,
  onPageChange,
  onPageSizeChange,
  onShipFilterChange,
  onStatusFilterChange,
  onTaskFormChange,
  onTaskStatusChange
}: MaintenancePanelProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const statusTab = (selectedStatus || "") as MaintenanceStatusTab;

  return (
    <section className={styles.panel}>
      <div className={styles.pageHeadingRow}>
        <div className={styles.pageHeadingCluster}>
          <span className={styles.pageHeadingAccent} aria-hidden />
          <h2 className={styles.pageHeadingTitle}>Maintenance</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ShipFilterSelect ships={ships} value={shipFilterId} onChange={onShipFilterChange} />
          <button className={styles.toolbarPrimaryButton} onClick={() => setIsDialogOpen(true)} type="button">Create task</button>
        </div>
      </div>

      <div className={styles.filterRibbon}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <InnerTabs embedded tabs={maintenanceStatusTabs} value={statusTab} onChange={(id) => onStatusFilterChange(id)} />
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <input className={styles.input} type="date" value={dueFrom} onChange={(event) => onDueFromChange(event.target.value)} />
            <span className="text-xs font-semibold text-ink-muted">to</span>
            <input className={styles.input} type="date" value={dueTo} onChange={(event) => onDueToChange(event.target.value)} />
            <button className={styles.toolbarIconButton} type="button" aria-label="Reset dates" onClick={() => { onDueFromChange(""); onDueToChange(""); }}>
              <i className="bi bi-arrow-counterclockwise" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <TaskTable
        tasks={tasks}
        crewById={crewById}
        shipById={shipById}
        onStatus={onTaskStatusChange}
        startIndex={(page - 1) * pageSize}
      />
      <Pagination page={page} pageSize={pageSize} total={total} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />

      <Dialog isOpen={isDialogOpen} title="Create Task" onClose={() => setIsDialogOpen(false)}>
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
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <input className={styles.input} placeholder="Task title" value={taskForm.title} onChange={(event) => onChange({ ...taskForm, title: event.target.value })} required />
      <input className={styles.input} placeholder="Description" value={taskForm.description} onChange={(event) => onChange({ ...taskForm, description: event.target.value })} required />
      <div className="grid gap-3 md:grid-cols-2">
        <select className={styles.input} value={taskForm.shipId} onChange={(event) => onChange({ ...taskForm, shipId: event.target.value })} required>
          <option value="" disabled>Select ship</option>
          {ships.map((ship) => (
            <option key={ship.id} value={ship.id}>{ship.name}</option>
          ))}
        </select>
        <select className={styles.input} value={taskForm.assignedCrewId} onChange={(event) => onChange({ ...taskForm, assignedCrewId: event.target.value })} required>
          <option value="" disabled>Select crew</option>
          {crew.map((member) => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </select>
      </div>
      <input className={styles.input} type="date" value={taskForm.dueDate} onChange={(event) => onChange({ ...taskForm, dueDate: event.target.value })} required />
      <div className="flex justify-end">
        <button className={styles.button} disabled={ships.length === 0 || crew.length === 0} type="submit">Create</button>
      </div>
    </form>
  );
}
