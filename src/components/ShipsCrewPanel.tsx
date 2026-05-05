import type { FormEvent } from "react";
import { styles } from "../constants";
import type { CrewMember, Ship } from "../types";
import type { CrewForm, ShipForm } from "../ui-types";

type ShipsCrewPanelProps = {
  crew: CrewMember[];
  crewForm: CrewForm;
  shipForm: ShipForm;
  ships: Ship[];
  onCreateCrewMember: () => Promise<void>;
  onCreateShip: () => Promise<void>;
  onCrewFormChange: (form: CrewForm) => void;
  onShipFormChange: (form: ShipForm) => void;
};

export function ShipsCrewPanel({
  crew,
  crewForm,
  shipForm,
  ships,
  onCreateCrewMember,
  onCreateShip,
  onCrewFormChange,
  onShipFormChange
}: ShipsCrewPanelProps) {
  return (
    <section className="grid gap-5 lg:grid-cols-2">
      <article className={styles.panel}>
        <h2 className="mb-5 text-xl font-extrabold">Create Ship</h2>
        <ShipFormView form={shipForm} onChange={onShipFormChange} onSubmit={onCreateShip} />
        <List title="Ships" items={ships.map((ship) => `${ship.name} (${ship.imo})`)} />
      </article>

      <article className={styles.panel}>
        <h2 className="mb-5 text-xl font-extrabold">Create Crew Member</h2>
        <CrewFormView form={crewForm} ships={ships} onChange={onCrewFormChange} onSubmit={onCreateCrewMember} />
        <List title="Crew" items={crew.map((member) => `${member.name} - ${member.role}`)} />
      </article>
    </section>
  );
}

function ShipFormView({
  form,
  onChange,
  onSubmit
}: {
  form: ShipForm;
  onChange: (form: ShipForm) => void;
  onSubmit: () => Promise<void>;
}) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit();
  };

  return (
    <form className="mb-6 flex flex-wrap gap-3" onSubmit={handleSubmit}>
      <input className={styles.input} placeholder="Ship name" value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} required />
      <input className={styles.input} placeholder="IMO number" value={form.imo} onChange={(event) => onChange({ ...form, imo: event.target.value })} required />
      <button className={styles.button} type="submit">Create Ship</button>
    </form>
  );
}

function CrewFormView({
  form,
  ships,
  onChange,
  onSubmit
}: {
  form: CrewForm;
  ships: Ship[];
  onChange: (form: CrewForm) => void;
  onSubmit: () => Promise<void>;
}) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit();
  };

  return (
    <form className="mb-6 flex flex-wrap gap-3" onSubmit={handleSubmit}>
      <input className={styles.input} placeholder="Crew name" value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} required />
      <input className={styles.input} placeholder="Crew role" value={form.role} onChange={(event) => onChange({ ...form, role: event.target.value })} required />
      <select className={styles.input} value={form.shipId} onChange={(event) => onChange({ ...form, shipId: event.target.value })} required>
        <option value="" disabled>Select ship</option>
        {ships.map((ship) => (
          <option key={ship.id} value={ship.id}>{ship.name}</option>
        ))}
      </select>
      <button className={styles.button} disabled={ships.length === 0} type="submit">Create Crew</button>
    </form>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-slate-500">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-slate-600">No records yet.</p>
      ) : (
        <ul className="grid gap-2">
          {items.map((item) => (
            <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700" key={item}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
