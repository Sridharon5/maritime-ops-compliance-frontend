import { styles } from "../constants";
import type { Ship } from "../types";
import { ToolbarSelect } from "./ToolbarSelect";

type ShipFilterSelectProps = {
  ships: Ship[];
  value: string;
  onChange: (shipId: string) => void;
};

/** Per-screen ship filter; does not share state with other views */
export function ShipFilterSelect({ ships, value, onChange }: ShipFilterSelectProps) {
  return (
    <ToolbarSelect>
      <select
        aria-label="Filter by ship"
        className={styles.toolbarControl}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">All ships</option>
        {ships.map((ship) => (
          <option key={ship.id} value={ship.id}>
            {ship.name}
          </option>
        ))}
      </select>
    </ToolbarSelect>
  );
}
