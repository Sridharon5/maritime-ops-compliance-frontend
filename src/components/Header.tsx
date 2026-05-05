import { styles } from "../constants";
import type { Role, Ship } from "../types";

type HeaderProps = {
  role: Role;
  ships: Ship[];
  selectedShipId: string;
  onRoleChange: (role: Role) => void;
  onShipChange: (shipId: string) => void;
};

export function Header({ role, ships, selectedShipId, onRoleChange, onShipChange }: HeaderProps) {
  return (
    <header className={`${styles.panel} flex flex-col justify-between gap-6 md:flex-row md:items-center`}>
      <div>
        <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-teal-700">Maritime Operations</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">Maintenance, Safety Drills and Compliance</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Track ship readiness, crew participation and operational risk from one dashboard.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <label className={styles.label}>
          Role
          <select className={styles.input} value={role} onChange={(event) => onRoleChange(event.target.value as Role)}>
            <option value="admin">Admin</option>
            <option value="crew">Crew</option>
          </select>
        </label>
        <label className={styles.label}>
          Ship
          <select className={styles.input} value={selectedShipId} onChange={(event) => onShipChange(event.target.value)}>
            <option value="">All ships</option>
            {ships.map((ship) => (
              <option key={ship.id} value={ship.id}>{ship.name}</option>
            ))}
          </select>
        </label>
      </div>
    </header>
  );
}
