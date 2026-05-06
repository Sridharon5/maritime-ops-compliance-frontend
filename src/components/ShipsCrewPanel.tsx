import type { FormEvent, ReactNode } from "react";
import { crewRegistryColumns, shipRegistryColumns } from "../config/tableLayouts";
import { styles } from "../constants";
import type { CrewMember, Ship } from "../types";
import type { CrewForm, ShipForm } from "../ui-types";
import { Dialog } from "./Dialog";
import { Pagination } from "./Pagination";
import { ShipFilterSelect } from "./ShipFilterSelect";
import { useState } from "react";

type ShipPanelProps = {
  shipForm: ShipForm;
  shipRows: Ship[];
  ships: Ship[];
  total: number;
  page: number;
  pageSize: number;
  onCreateShip: () => Promise<void>;
  onShipFormChange: (form: ShipForm) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

type CrewManagementPanelProps = {
  crewForm: CrewForm;
  crewRows: CrewMember[];
  page: number;
  pageSize: number;
  shipFilterId: string;
  ships: Ship[];
  total: number;
  onCreateCrewMember: () => Promise<void>;
  onCrewFormChange: (form: CrewForm) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onShipFilterChange: (shipId: string) => void;
};

export function ShipPanel({
  shipForm,
  shipRows,
  ships,
  total,
  page,
  pageSize,
  onCreateShip,
  onShipFormChange,
  onPageChange,
  onPageSizeChange
}: ShipPanelProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const col = shipRegistryColumns;

  return (
    <section className={styles.panel}>
      <PageHeader title="Ships" actionLabel="Create ship" onAction={() => setIsDialogOpen(true)} />

      {shipRows.length === 0 ? (
        <p className={styles.emptyState}>No ships found.</p>
      ) : (
        <>
          <div className={styles.tableSurround}>
            <table className="w-full table-fixed border-collapse text-left text-sm">
              <thead>
                <tr className={styles.tableHeadRow}>
                  <th className={`p-3 text-left text-xs font-bold uppercase tracking-wide ${col.sNo}`}>S.No</th>
                  <th className={`p-3 text-left text-xs font-bold uppercase tracking-wide ${col.imo}`}>IMO</th>
                  <th className={`p-3 text-left text-xs font-bold uppercase tracking-wide ${col.name}`}>Vessel</th>
                </tr>
              </thead>
              <tbody>
                {shipRows.map((ship, index) => (
                  <tr className={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd} key={ship.id}>
                    <td className={`p-3 font-semibold ${col.sNo}`}>{(page - 1) * pageSize + index + 1}</td>
                    <td className={`p-3 ${col.imo}`}>{ship.imo}</td>
                    <td className={`p-3 font-extrabold text-ink-heading ${col.name}`}>{ship.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />
        </>
      )}

      <Dialog isOpen={isDialogOpen} title="Create Ship" onClose={() => setIsDialogOpen(false)}>
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
  crewForm,
  crewRows,
  page,
  pageSize,
  shipFilterId,
  ships,
  total,
  onCreateCrewMember,
  onCrewFormChange,
  onPageChange,
  onPageSizeChange,
  onShipFilterChange
}: CrewManagementPanelProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const shipById = Object.fromEntries(ships.map((ship) => [ship.id, ship]));
  const col = crewRegistryColumns;

  return (
    <section className={styles.panel}>
      <PageHeader title="Crew" actionLabel="Create crew" extraAction={<ShipFilterSelect ships={ships} value={shipFilterId} onChange={onShipFilterChange} />} onAction={() => setIsDialogOpen(true)} />

      {crewRows.length === 0 ? (
        <p className={styles.subtlePanel}>No crew found.</p>
      ) : (
        <>
          <div className={styles.tableSurround}>
            <table className="w-full table-fixed border-collapse text-left text-sm">
              <thead>
                <tr className={styles.tableHeadRow}>
                  <th className={`p-3 text-left text-xs font-bold uppercase tracking-wide ${col.sNo}`}>S.No</th>
                  <th className={`p-3 text-left text-xs font-bold uppercase tracking-wide ${col.name}`}>Name</th>
                  <th className={`p-3 text-left text-xs font-bold uppercase tracking-wide ${col.role}`}>Role</th>
                  <th className={`p-3 text-left text-xs font-bold uppercase tracking-wide ${col.ship}`}>Ship</th>
                </tr>
              </thead>
              <tbody>
                {crewRows.map((member, index) => (
                  <tr className={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd} key={member.id}>
                    <td className={`p-3 font-semibold ${col.sNo}`}>{(page - 1) * pageSize + index + 1}</td>
                    <td className={`p-3 font-extrabold text-ink-heading ${col.name}`}>{member.name}</td>
                    <td className={`p-3 ${col.role}`}>{member.role}</td>
                    <td className={`truncate p-3 ${col.ship}`}>{shipById[member.shipId]?.name ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />
        </>
      )}

      <Dialog isOpen={isDialogOpen} title="Create Crew" onClose={() => setIsDialogOpen(false)}>
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

function ShipFormView({ form, onChange, onSubmit }: { form: ShipForm; onChange: (form: ShipForm) => void; onSubmit: () => Promise<void> }) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit();
  };

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <input className={styles.input} placeholder="Ship name" value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} required />
      <input className={styles.input} placeholder="IMO number" value={form.imo} onChange={(event) => onChange({ ...form, imo: event.target.value })} required />
      <div className="flex justify-end">
        <button className={styles.button} type="submit">Create</button>
      </div>
    </form>
  );
}

function CrewFormView({ form, ships, onChange, onSubmit }: { form: CrewForm; ships: Ship[]; onChange: (form: CrewForm) => void; onSubmit: () => Promise<void> }) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit();
  };

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <input className={styles.input} placeholder="Crew name" value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} required />
      <input className={styles.input} placeholder="Crew role" value={form.role} onChange={(event) => onChange({ ...form, role: event.target.value })} required />
      <select className={styles.input} value={form.shipId} onChange={(event) => onChange({ ...form, shipId: event.target.value })} required>
        <option value="" disabled>Select ship</option>
        {ships.map((ship) => (
          <option key={ship.id} value={ship.id}>{ship.name}</option>
        ))}
      </select>
      <div className="flex justify-end">
        <button className={styles.button} disabled={ships.length === 0} type="submit">Create</button>
      </div>
    </form>
  );
}

function PageHeader({
  actionLabel,
  extraAction,
  title,
  onAction
}: {
  actionLabel: string;
  extraAction?: ReactNode;
  title: string;
  onAction: () => void;
}) {
  return (
    <div className={styles.pageHeadingRow}>
      <div className={styles.pageHeadingCluster}>
        <span className={styles.pageHeadingAccent} aria-hidden />
        <h2 className={styles.pageHeadingTitle}>{title}</h2>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {extraAction}
        <button className={styles.toolbarPrimaryButton} onClick={onAction} type="button">{actionLabel}</button>
      </div>
    </div>
  );
}
