import type { ChangeEvent, FormEvent } from "react";
import { styles } from "../constants";
import type { CrewMember, SafetyDrill, Ship } from "../types";
import type { DrillForm, EntityMap } from "../ui-types";
import { DrillList } from "./DrillList";

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
  return (
    <section className={styles.panel}>
      <h2 className="mb-5 text-xl font-extrabold">Safety Drill Management</h2>
      <DrillFormView crew={crew} drillForm={drillForm} ships={ships} onChange={onDrillFormChange} onSubmit={onCreateDrill} />
      <DrillList drills={drills} shipById={shipById} crewById={crewById} onAttendance={onAttendance} onComplete={onComplete} />
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
    <form className="mb-6 flex flex-wrap gap-3" onSubmit={handleSubmit}>
      <input className={styles.input} placeholder="Drill type" value={drillForm.type} onChange={(event) => onChange({ ...drillForm, type: event.target.value })} required />
      <select className={styles.input} value={drillForm.shipId} onChange={(event) => onChange({ ...drillForm, shipId: event.target.value })}>
        {ships.map((ship) => (
          <option key={ship.id} value={ship.id}>{ship.name}</option>
        ))}
      </select>
      <input className={styles.input} type="date" value={drillForm.scheduledDate} onChange={(event) => onChange({ ...drillForm, scheduledDate: event.target.value })} required />
      <select className={styles.input} multiple value={drillForm.assignedCrewIds} onChange={updateAssignedCrew}>
        {crew.map((member) => (
          <option key={member.id} value={member.id}>{member.name}</option>
        ))}
      </select>
      <button className={styles.button} type="submit">Schedule Drill</button>
    </form>
  );
}
