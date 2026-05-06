import { styles } from "../constants";

export type InnerTabDef<T extends string> = {
  id: T;
  label: string;
  iconClass?: string;
};

export type InnerTabsAccent = "brand" | "secondary";

type InnerTabsProps<T extends string> = {
  tabs: readonly InnerTabDef<T>[];
  value: T;
  onChange: (id: T) => void;
  /** Maintenance = brand blue; Drills = teal */
  accent?: InnerTabsAccent;
  /** Inside filter ribbon — no bottom divider */
  embedded?: boolean;
  className?: string;
};

export function InnerTabs<T extends string>({
  tabs,
  value,
  onChange,
  accent = "brand",
  embedded = false,
  className = ""
}: InnerTabsProps<T>) {
  const railClass = embedded ? "" : "border-b border-line-default pb-2 dark:border-line-strong";
  const activeClass =
    accent === "secondary" ? styles.innerTabActiveSecondary : styles.innerTabActiveBrand;
  const inactiveClass =
    accent === "secondary" ? styles.innerTabInactiveSecondary : styles.innerTabInactiveBrand;

  return (
    <div className={`flex flex-wrap gap-2 ${railClass} ${className}`} role="tablist">
      {tabs.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            className={active ? activeClass : inactiveClass}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
