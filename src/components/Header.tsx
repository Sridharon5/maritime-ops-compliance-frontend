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
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5 text-white"
          >
            <path d="M12 2a1 1 0 0 1 .894.553l2.382 4.764 5.256.763a1 1 0 0 1 .554 1.706l-3.8 3.705.897 5.23a1 1 0 0 1-1.45 1.054L12 17.27l-4.733 2.488a1 1 0 0 1-1.45-1.054l.897-5.23L2.914 9.786a1 1 0 0 1 .554-1.706l5.256-.763L11.106 2.553A1 1 0 0 1 12 2Z" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-teal-700">
            Maritime Operations
          </p>
          <h1 className="text-base font-extrabold leading-tight tracking-tight text-slate-950">
            Maintenance, Safety Drills &amp; Compliance
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className={styles.label}>
          Role
          <select
            className={styles.input}
            value={role}
            onChange={(e) => onRoleChange(e.target.value as Role)}
          >
            <option value="admin">Admin</option>
            <option value="crew">Crew</option>
          </select>
        </label>
        <label className={styles.label}>
          Ship
          <select
            className={styles.input}
            value={selectedShipId}
            onChange={(e) => onShipChange(e.target.value)}
          >
            <option value="">All ships</option>
            {ships.map((ship) => (
              <option key={ship.id} value={ship.id}>
                {ship.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </header>
  );
}
