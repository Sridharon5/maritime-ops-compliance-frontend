import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { styles } from "../constants";
import type { CrewMember, SafetyDrill, Ship } from "../types";
import type { DrillForm, EntityMap } from "../ui-types";
import { Dialog } from "./Dialog";
import { DrillList } from "./DrillList";
import { ShipFilterSelect } from "./ShipFilterSelect";

type DrillPanelProps = {
  crew: CrewMember[];
  crewById: EntityMap<CrewMember>;
  drillForm: DrillForm;
  drills: SafetyDrill[];
  shipById: EntityMap<Ship>;
  ships: Ship[];
  onAttendance: (id: string) => void;
  onComplete: (id: string) => void;
  onCreateDrill: () => Promise<void>;
  onDrillFormChange: (form: DrillForm) => void;
};

export function DrillPanel({
  crew,
  crewById,
  drillForm,
  drills,
  shipById,
  ships,
  onAttendance,
  onComplete,
  onCreateDrill,
  onDrillFormChange
}: DrillPanelProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [shipFilterId, setShipFilterId] = useState("");

  const filteredDrills = useMemo(
    () => drills.filter((drill) => !shipFilterId || drill.shipId === shipFilterId),
    [drills, shipFilterId]
  );

  return (
    <section className={styles.panel}>
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-300">Safety readiness</p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white">Safety Drill Management</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Schedule drills, track attendance and close completion evidence.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ShipFilterSelect ships={ships} value={shipFilterId} onChange={setShipFilterId} />
          <button className={styles.button} onClick={() => setIsDialogOpen(true)} type="button">Schedule Drill</button>
        </div>
      </div>

      <DrillList drills={filteredDrills} shipById={shipById} crewById={crewById} onAttendance={onAttendance} onComplete={onComplete} />

      <Dialog
        description="Select the vessel, date and crew members who must participate."
        isOpen={isDialogOpen}
        title="Schedule Safety Drill"
        onClose={() => setIsDialogOpen(false)}
      >
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
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <label className={styles.label}>
        Drill type
        <input className={styles.input} placeholder="Fire drill" value={drillForm.type} onChange={(event) => onChange({ ...drillForm, type: event.target.value })} required />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className={styles.label}>
          Ship
          <select className={styles.input} value={drillForm.shipId} onChange={(event) => onChange({ ...drillForm, shipId: event.target.value })}>
            {ships.map((ship) => (
              <option key={ship.id} value={ship.id}>{ship.name}</option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Scheduled date
          <input className={styles.input} type="date" value={drillForm.scheduledDate} onChange={(event) => onChange({ ...drillForm, scheduledDate: event.target.value })} required />
        </label>
      </div>
      <label className={styles.label}>
        Assigned crew
        <select className={`${styles.input} min-h-36`} multiple value={drillForm.assignedCrewIds} onChange={updateAssignedCrew}>
          {crew.map((member) => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </select>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Hold Ctrl or Cmd to select multiple crew members.</span>
      </label>
      <div className="flex justify-end">
        <button className={styles.button} disabled={ships.length === 0 || crew.length === 0} type="submit">Schedule Drill</button>
      </div>
    </form>
  );
}
