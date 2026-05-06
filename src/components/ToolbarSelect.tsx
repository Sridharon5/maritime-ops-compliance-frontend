import { cloneElement, isValidElement, type ReactElement } from "react";

type ToolbarSelectProps = {
  className?: string;
  /** Dark header bar — light chevron for contrast */
  variant?: "default" | "dark";
  children: ReactElement<HTMLSelectElement>;
};

/** Wraps a native `<select>` with toolbar padding and a chevron (Bootstrap Icons). */
export function ToolbarSelect({ className = "", variant = "default", children }: ToolbarSelectProps) {
  if (!isValidElement(children)) {
    return children;
  }

  const child = children as ReactElement<HTMLSelectElement>;
  const mergedClass = [child.props.className, "w-full max-w-full appearance-none"].filter(Boolean).join(" ");

  return (
    <div className={`relative inline-flex min-w-0 max-w-full ${className}`}>
      <span
        className={`pointer-events-none absolute inset-y-0 right-3 flex items-center ${variant === "dark" ? "text-white/75" : "text-ink-muted"}`}
        aria-hidden
      >
        <i className="bi bi-chevron-down text-xs opacity-80" />
      </span>
      {cloneElement(child, {
        className: `${mergedClass} pr-11`
      })}
    </div>
  );
}
