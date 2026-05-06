import { useState, type ChangeEvent, type FormEvent } from "react";
import type { DrillStatusFilter } from "../types";
import type { InnerTabDef } from "./InnerTabs";
import { InnerTabs } from "./InnerTabs";
import { Pagination } from "./Pagination";
import { styles } from "../constants";
import type { CrewMember, SafetyDrill, Ship } from "../types";
import type { DrillForm, EntityMap } from "../ui-types";
import { Dialog } from "./Dialog";
import { DrillList } from "./DrillList";
import { ShipFilterSelect } from "./ShipFilterSelect";

const drillStatusTabs: readonly InnerTabDef<DrillStatusFilter>[] = [
  { id: "", label: "All" },
  { id: "Scheduled", label: "Scheduled" },
  { id: "Completed", label: "Completed" }
];

type DrillPanelProps = {
  crew: CrewMember[];
  crewById: EntityMap<CrewMember>;
  drillForm: DrillForm;
  drills: SafetyDrill[];
  page: number;
  pageSize: number;
  scheduledFrom: string;
  scheduledTo: string;
  selectedDrillStatus: DrillStatusFilter;
  shipById: EntityMap<Ship>;
  shipFilterId: string;
  ships: Ship[];
  total: number;
  onCreateDrill: () => Promise<void>;
  onDrillFormChange: (form: DrillForm) => void;
  onDrillStatusFilterChange: (status: DrillStatusFilter) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onScheduledFromChange: (value: string) => void;
  onScheduledToChange: (value: string) => void;
  onShipFilterChange: (shipId: string) => void;
};

export function DrillPanel({
  crew,
  crewById,
  drillForm,
  drills,
  page,
  pageSize,
  scheduledFrom,
  scheduledTo,
  selectedDrillStatus,
  shipById,
  shipFilterId,
  ships,
  total,
  onCreateDrill,
  onDrillFormChange,
  onDrillStatusFilterChange,
  onPageChange,
  onPageSizeChange,
  onScheduledFromChange,
  onScheduledToChange,
  onShipFilterChange
}: DrillPanelProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <section className={styles.panel}>
      <div className={styles.pageHeadingRow}>
        <div className={styles.pageHeadingCluster}>
          <span className={styles.pageHeadingAccent} aria-hidden />
          <h2 className={styles.pageHeadingTitle}>Drills</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ShipFilterSelect ships={ships} value={shipFilterId} onChange={onShipFilterChange} />
          <button className={styles.toolbarPrimaryButton} onClick={() => setIsDialogOpen(true)} type="button">Schedule drill</button>
        </div>
      </div>

      <div className={styles.filterRibbon}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <InnerTabs accent="secondary" embedded tabs={drillStatusTabs} value={selectedDrillStatus} onChange={onDrillStatusFilterChange} />
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <input className={styles.input} type="date" value={scheduledFrom} onChange={(event) => onScheduledFromChange(event.target.value)} />
            <span className="text-xs font-semibold text-ink-muted">to</span>
            <input className={styles.input} type="date" value={scheduledTo} onChange={(event) => onScheduledToChange(event.target.value)} />
            <button className={styles.toolbarIconButton} type="button" aria-label="Reset dates" onClick={() => { onScheduledFromChange(""); onScheduledToChange(""); }}>
              <i className="bi bi-arrow-counterclockwise" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <DrillList drills={drills} shipById={shipById} crewById={crewById} />
      <Pagination page={page} pageSize={pageSize} total={total} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />

      <Dialog isOpen={isDialogOpen} title="Schedule Drill" onClose={() => setIsDialogOpen(false)}>
        <DrillFormView
          crew={crew}
          drillForm={drillForm}
          ships={ships}
          onChange={onDrillFormChange}
          onSubmit={async () => {
            await onCreateDrill();
            setIsDialogOpen(false);
          }}
        />
      </Dialog>
    </section>
  );
}

function DrillFormView({
  crew,
  drillForm,
  ships,
  onChange,
  onSubmit
}: {
  crew: CrewMember[];
  drillForm: DrillForm;
  ships: Ship[];
  onChange: (form: DrillForm) => void;
  onSubmit: () => Promise<void>;
}) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit();
  };

  const updateAssignedCrew = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...drillForm, assignedCrewIds: Array.from(event.target.selectedOptions, (option) => option.value) });
  };

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <input className={styles.input} placeholder="Drill type" value={drillForm.type} onChange={(event) => onChange({ ...drillForm, type: event.target.value })} required />
      <div className="grid gap-3 md:grid-cols-2">
        <select className={styles.input} value={drillForm.shipId} onChange={(event) => onChange({ ...drillForm, shipId: event.target.value })} required>
          <option value="" disabled>Select ship</option>
          {ships.map((ship) => (
            <option key={ship.id} value={ship.id}>{ship.name}</option>
          ))}
        </select>
        <input className={styles.input} type="date" value={drillForm.scheduledDate} onChange={(event) => onChange({ ...drillForm, scheduledDate: event.target.value })} required />
      </div>
      <select className={`${styles.input} min-h-32`} multiple value={drillForm.assignedCrewIds} onChange={updateAssignedCrew} required>
        {crew.map((member) => (
          <option key={member.id} value={member.id}>{member.name}</option>
        ))}
      </select>
      <div className="flex justify-end">
        <button className={styles.button} disabled={ships.length === 0 || crew.length === 0} type="submit">Schedule</button>
      </div>
    </form>
  );
}
