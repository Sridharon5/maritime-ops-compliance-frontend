import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { styles } from "../constants";
import type { CrewMember, Ship } from "../types";
import type { CrewForm, ShipForm } from "../ui-types";
import { Dialog } from "./Dialog";
import { ShipFilterSelect } from "./ShipFilterSelect";

type ShipPanelProps = {
  shipForm: ShipForm;
  ships: Ship[];
  onCreateShip: () => Promise<void>;
  onShipFormChange: (form: ShipForm) => void;
};

type CrewManagementPanelProps = {
  crew: CrewMember[];
  crewForm: CrewForm;
  ships: Ship[];
  onCreateCrewMember: () => Promise<void>;
  onCrewFormChange: (form: CrewForm) => void;
};

export function ShipPanel({
  shipForm,
  ships,
  onCreateShip,
  onShipFormChange
}: ShipPanelProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <section className={styles.panel}>
      <PageHeader
        eyebrow="Fleet setup"
        title="Ships"
        description="Keep vessel records clean before assigning maintenance or drills."
        actionLabel="Create Ship"
        onAction={() => setIsDialogOpen(true)}
      />

      <RecordGrid
        emptyText="No ships yet. Create a ship to start assigning crew and activities."
        items={ships.map((ship) => ({
          id: ship.id,
          title: ship.name,
          details: [`IMO ${ship.imo}`]
        }))}
      />

      <Dialog
        description="Add the vessel name and IMO number."
        isOpen={isDialogOpen}
        title="Create Ship"
        onClose={() => setIsDialogOpen(false)}
      >
        <ShipFormView
          form={shipForm}
          onChange={onShipFormChange}
          onSubmit={async () => {
            await onCreateShip();
            setIsDialogOpen(false);
          }}
        />
      </Dialog>
    </section>
  );
}

export function CrewManagementPanel({
  crew,
  crewForm,
  ships,
  onCreateCrewMember,
  onCrewFormChange
}: CrewManagementPanelProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [shipFilterId, setShipFilterId] = useState("");
  const shipById = Object.fromEntries(ships.map((ship) => [ship.id, ship]));

  const filteredCrew = useMemo(
    () => crew.filter((member) => !shipFilterId || member.shipId === shipFilterId),
    [crew, shipFilterId]
  );

  return (
    <section className={styles.panel}>
      <PageHeader
        eyebrow="People setup"
        title="Crew"
        description="Manage crew members separately so assignments stay easier to review."
        actionLabel="Create Crew"
        extraAction={<ShipFilterSelect ships={ships} value={shipFilterId} onChange={setShipFilterId} />}
        onAction={() => setIsDialogOpen(true)}
      />

      <RecordGrid
        emptyText="No crew members yet. Add crew after creating at least one ship."
        items={filteredCrew.map((member) => ({
          id: member.id,
          title: member.name,
          details: [member.role, shipById[member.shipId]?.name ?? "Unassigned ship"]
        }))}
      />

      <Dialog
        description="Assign a crew member to a ship and define their onboard role."
        isOpen={isDialogOpen}
        title="Create Crew Member"
        onClose={() => setIsDialogOpen(false)}
      >
        <CrewFormView
          form={crewForm}
          ships={ships}
          onChange={onCrewFormChange}
          onSubmit={async () => {
            await onCreateCrewMember();
            setIsDialogOpen(false);
          }}
        />
      </Dialog>
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
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <label className={styles.label}>
        Ship name
        <input className={styles.input} placeholder="Ocean Voyager" value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} required />
      </label>
      <label className={styles.label}>
        IMO number
        <input className={styles.input} placeholder="IMO 9876543" value={form.imo} onChange={(event) => onChange({ ...form, imo: event.target.value })} required />
      </label>
      <div className="flex justify-end">
        <button className={styles.button} type="submit">Create Ship</button>
      </div>
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
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <label className={styles.label}>
        Crew name
        <input className={styles.input} placeholder="Anil Verma" value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} required />
      </label>
      <label className={styles.label}>
        Crew role
        <input className={styles.input} placeholder="Chief Engineer" value={form.role} onChange={(event) => onChange({ ...form, role: event.target.value })} required />
      </label>
      <label className={styles.label}>
        Ship
        <select className={styles.input} value={form.shipId} onChange={(event) => onChange({ ...form, shipId: event.target.value })} required>
          <option value="" disabled>Select ship</option>
          {ships.map((ship) => (
            <option key={ship.id} value={ship.id}>{ship.name}</option>
          ))}
        </select>
      </label>
      <div className="flex justify-end">
        <button className={styles.button} disabled={ships.length === 0} type="submit">Create Crew</button>
      </div>
    </form>
  );
}

function PageHeader({
  actionLabel,
  description,
  eyebrow,
  extraAction,
  title,
  onAction
}: {
  actionLabel: string;
  description: string;
  eyebrow: string;
  extraAction?: ReactNode;
  title: string;
  onAction: () => void;
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-300">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {extraAction}
        <button className={styles.button} onClick={onAction} type="button">{actionLabel}</button>
      </div>
    </div>
  );
}

function RecordGrid({
  emptyText,
  items
}: {
  emptyText: string;
  items: { id: string; title: string; details: string[] }[];
}) {
  if (items.length === 0) {
    return <p className={styles.subtlePanel}>{emptyText}</p>;
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <article className={styles.subtlePanel} key={item.id}>
          <h3 className="font-extrabold text-slate-950 dark:text-white">{item.title}</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.details.join(" | ")}</p>
        </article>
      ))}
    </div>
  );
}
