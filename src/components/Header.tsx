import { styles } from "../constants";
import type { CrewMember, Role } from "../types";
import { ToolbarSelect } from "./ToolbarSelect";

type HeaderProps = {
  crew: CrewMember[];
  role: Role;
  selectedCrewId: string;
  theme: "light" | "dark";
  onCrewChange: (crewId: string) => void;
  onRoleChange: (role: Role) => void;
  onThemeToggle: () => void;
};

export function Header({
  crew,
  role,
  selectedCrewId,
  theme,
  onCrewChange,
  onRoleChange,
  onThemeToggle
}: HeaderProps) {
  return (
    <header
      className={`sticky top-0 z-30 flex min-h-[var(--layout-navbar-min-height)] items-center px-4 py-2 sm:px-6 ${styles.headerBar}`}
    >
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        <h1 className={`truncate text-lg font-extrabold tracking-tight sm:text-xl ${styles.headerBarTitle}`}>
          Maritime Operations & Compliance System
        </h1>

        <div className="flex flex-wrap items-center gap-2">
          <ToolbarSelect variant="dark" className="min-w-[8.5rem] max-w-[10rem]">
            <select
              aria-label="Role"
              className={`${styles.headerToolbarControl} native-select-option-readable`}
              value={role}
              onChange={(event) => onRoleChange(event.target.value as Role)}
            >
              <option value="admin">Admin</option>
              <option value="crew">Crew</option>
            </select>
          </ToolbarSelect>

          {role === "crew" ? (
            <ToolbarSelect variant="dark" className="min-w-[9.5rem] max-w-[12rem]">
              <select
                aria-label="Crew member"
                className={`${styles.headerToolbarControl} native-select-option-readable`}
                value={selectedCrewId}
                onChange={(event) => onCrewChange(event.target.value)}
              >
                {crew.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </ToolbarSelect>
          ) : null}

          <button className={`${styles.headerToolbarGhostButton} inline-flex items-center gap-1.5`} onClick={onThemeToggle} type="button">
            <i className={theme === "dark" ? "bi bi-sun-fill" : "bi bi-moon-stars-fill"} aria-hidden />
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </div>
    </header>
  );
}
