import { styles } from "../constants";
import type { Role } from "../types";

type HeaderProps = {
  role: Role;
  theme: "light" | "dark";
  onRoleChange: (role: Role) => void;
  onThemeToggle: () => void;
};

export function Header({ role, theme, onRoleChange, onThemeToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-slate-50/90 px-5 py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 sm:px-8">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

        <div className="flex flex-wrap items-end gap-3">
          <label className={styles.label}>
            <select className={styles.input} value={role} onChange={(event) => onRoleChange(event.target.value as Role)}>
              <option value="admin">Admin</option>
              <option value="crew">Crew</option>
            </select>
          </label>
          <button className={styles.ghostButton} onClick={onThemeToggle} type="button">
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </div>
    </header>
  );
}
