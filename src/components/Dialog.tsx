import type { ReactNode } from "react";
import { styles } from "../constants";

type DialogProps = {
  children: ReactNode;
  description?: string;
  isOpen: boolean;
  title: string;
  onClose: () => void;
};

export function Dialog({ children, description, isOpen, title, onClose }: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-scrim px-4 py-8 backdrop-blur-sm">
      <section className="relative w-full max-w-2xl overflow-hidden rounded-[var(--radius-lg)] border border-line-default bg-canvas-elevated shadow-2xl ring-1 ring-brand-900/[0.08] dark:border-line-strong dark:ring-white/[0.06]">
        <div className="h-1 bg-gradient-to-r from-brand-600 via-secondary-500 to-brand-700" aria-hidden />
        <div className="p-6">
          <div className="mb-5 flex items-start justify-between gap-4 border-b border-line-default pb-4 dark:border-line-strong">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-ink-heading">{title}</h2>
              {description ? <p className="mt-1 text-sm text-ink-muted">{description}</p> : null}
            </div>
            <button className={styles.ghostButton} onClick={onClose} type="button">
              Close
            </button>
          </div>
          {children}
        </div>
      </section>
    </div>
  );
}
