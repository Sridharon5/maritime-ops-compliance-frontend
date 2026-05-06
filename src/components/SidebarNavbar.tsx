import { styles, tabNavIcons } from "../constants";
import type { AppTab } from "../ui-types";

type SidebarNavbarProps = {
  activeTab: AppTab;
  profileName: string;
  profileRole: "Admin" | "Crew";
  visibleTabs: readonly AppTab[];
  onTabChange: (tab: AppTab) => void;
};

export function SidebarNavbar({ activeTab, profileName, profileRole, visibleTabs, onTabChange }: SidebarNavbarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden h-screen w-[var(--layout-sidebar-width)] flex-col border-r border-sidebar-border bg-sidebar-bg lg:flex">
      <div className="flex h-[40%] min-h-[9rem] shrink-0 flex-col items-center justify-center gap-3 border-b border-sidebar-border px-3 text-center">
        <div
          className="grid h-28 w-28 place-items-center rounded-full bg-sidebar-active-bg/35 text-7xl leading-none text-sidebar-fg shadow-inner ring-2 ring-sidebar-fg/20 transition-[var(--transition-fast)]"
          aria-hidden
        >
          <i className="bi bi-person-circle" />
        </div>
        <p className="text-xs font-bold uppercase tracking-wide text-sidebar-fg/70">{profileRole}</p>
        <p className="min-w-0 truncate px-1 text-lg font-extrabold leading-tight text-sidebar-fg">{profileName}</p>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-3 py-3.5" aria-label="Primary">
        {visibleTabs.map((tab) => (
          <button
            key={tab}
            className={tab === activeTab ? styles.sidebarNavActive : styles.sidebarNavInactive}
            onClick={() => onTabChange(tab)}
            type="button"
          >
            <i className={`${tabNavIcons[tab]} shrink-0 text-base leading-none text-sidebar-fg`} aria-hidden />
            <span className="truncate">{tab}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
