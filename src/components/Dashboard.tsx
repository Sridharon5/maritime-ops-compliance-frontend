import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../api";
import {
  complianceScoreTextClass,
  metricCardAccentClass,
  styles,
  type MetricCardAccent
} from "../constants";
import type { ComplianceSummary, Ship } from "../types";
import { ShipFilterSelect } from "./ShipFilterSelect";

type FocusMode = "maintenance" | "drills";

const fillMaintenance = "var(--palette-chart-maintenance)";
const fillDrills = "var(--palette-chart-drills)";
const fillOverall = "var(--palette-chart-overall)";

export function Dashboard({ ships }: { ships: Ship[] }) {
  const [shipId, setShipId] = useState("");
  const [focusMode, setFocusMode] = useState<FocusMode>("maintenance");
  const [compliance, setCompliance] = useState<ComplianceSummary | null>(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const qs = shipId ? `?shipId=${encodeURIComponent(shipId)}` : "";
    setCompliance(null);
    setLoadError("");
    api.compliance(qs).then((data) => {
      if (!cancelled) setCompliance(data);
    }).catch(() => {
      if (!cancelled) {
        setCompliance(null);
        setLoadError("Could not load compliance.");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [shipId]);

  const chartData = useMemo(() => {
    if (!compliance) return [];
    if (focusMode === "maintenance") {
      return [
        { name: "Maintenance", value: compliance.maintenanceCompletionPercent },
        { name: "Fleet overall", value: compliance.overallCompliancePercent }
      ];
    }
    return [
      { name: "Drills", value: compliance.drillParticipationPercent },
      { name: "Fleet overall", value: compliance.overallCompliancePercent }
    ];
  }, [compliance, focusMode]);

  const chartFills = useMemo(() => {
    if (focusMode === "maintenance") return [fillMaintenance, fillOverall];
    return [fillDrills, fillOverall];
  }, [focusMode]);

  const statusAccent = useMemo((): MetricCardAccent => {
    if (!compliance) return "neutral";
    if (compliance.status === "Compliant") return "compliance";
    if (compliance.status === "At Risk") return "atRisk";
    return "risk";
  }, [compliance]);

  const maintenanceAccent = useMemo((): MetricCardAccent => {
    if (!compliance) return "neutral";
    const v = compliance.maintenanceCompletionPercent;
    if (v >= 90) return "compliance";
    if (v >= 70) return "atRisk";
    return "risk";
  }, [compliance]);

  const drillsAccent = useMemo((): MetricCardAccent => {
    if (!compliance) return "neutral";
    const v = compliance.drillParticipationPercent;
    if (v >= 90) return "compliance";
    if (v >= 70) return "atRisk";
    return "risk";
  }, [compliance]);

  return (
    <section>
      {!compliance && !loadError ? <p className="text-sm font-semibold text-ink-muted">Loading compliance…</p> : null}
      {loadError ? <p className="text-sm font-semibold text-danger-dark">{loadError}</p> : null}

      {compliance ? (
        <>
          <div className={`${styles.filterRibbon} mb-6`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Dashboard section">
                <button
                  className={focusMode === "maintenance" ? styles.toolbarPrimaryButton : styles.toolbarGhostButton}
                  type="button"
                  role="tab"
                  aria-selected={focusMode === "maintenance"}
                  onClick={() => setFocusMode("maintenance")}
                >
                  Maintenance
                </button>
                <button
                  className={focusMode === "drills" ? styles.toolbarPrimaryButton : styles.toolbarGhostButton}
                  type="button"
                  role="tab"
                  aria-selected={focusMode === "drills"}
                  onClick={() => setFocusMode("drills")}
                >
                  Drills
                </button>
              </div>
              <div className="flex w-full min-w-0 shrink-0 flex-wrap items-center justify-end gap-2 sm:w-auto">
                <ShipFilterSelect ships={ships} value={shipId} onChange={setShipId} />
              </div>
            </div>
          </div>

          <div role="tabpanel" aria-live="polite">
            {focusMode === "maintenance" ? (
              <MaintenanceDashboardSection
                compliance={compliance}
                chartData={chartData}
                chartFills={chartFills}
                maintenanceAccent={maintenanceAccent}
                statusAccent={statusAccent}
              />
            ) : (
              <DrillsDashboardSection
                compliance={compliance}
                chartData={chartData}
                chartFills={chartFills}
                drillsAccent={drillsAccent}
                statusAccent={statusAccent}
              />
            )}
          </div>
        </>
      ) : null}
    </section>
  );
}

function MaintenanceDashboardSection({
  compliance,
  chartData,
  chartFills,
  maintenanceAccent,
  statusAccent
}: {
  compliance: ComplianceSummary;
  chartData: { name: string; value: number }[];
  chartFills: string[];
  maintenanceAccent: MetricCardAccent;
  statusAccent: MetricCardAccent;
}) {
  const showAlert = compliance.overdueMaintenance.length > 0;

  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
      {showAlert ? (
        <div className={`${styles.dashboardComplianceAlert} xl:col-span-4`} role="status">
          <p className="font-extrabold text-ink-heading dark:text-white">Maintenance alerts</p>
          <p className="mt-2 font-semibold">
            {compliance.overdueMaintenance.length} overdue{" "}
            {compliance.overdueMaintenance.length === 1 ? "task" : "tasks"} (past due date, not completed).
          </p>
        </div>
      ) : null}

      <MetricCard accent={statusAccent} title="Fleet status" value={compliance.status} />
      <MetricCard
        accent="maintenance"
        scorePercent={compliance.maintenanceCompletionPercent}
        title="Maintenance completion"
        value={`${compliance.maintenanceCompletionPercent}%`}
      />
      <MetricCard accent="maintenance" title="Pending tasks" value={String(compliance.pendingMaintenance)} />
      <MetricCard
        accent="compliance"
        title="Completed vs total"
        value={
          compliance.totalMaintenance === 0 ? "0 / 0" : `${compliance.completedMaintenance} / ${compliance.totalMaintenance}`
        }
      />

      <article className={`${styles.dashboardPanel} ${metricCardAccentClass[maintenanceAccent]} xl:col-span-2`}>
        <h3 className="mb-3 text-sm font-extrabold text-ink-heading">Maintenance vs fleet overall (%)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--palette-border-light)" />
            <XAxis dataKey="name" stroke="var(--palette-text-muted)" tick={{ fill: "var(--palette-text-muted)", fontSize: 11 }} />
            <YAxis domain={[0, 100]} stroke="var(--palette-text-muted)" tick={{ fill: "var(--palette-text-muted)", fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: "var(--radius-sm)", borderColor: "var(--palette-border-light)" }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={chartFills[index] ?? chartFills[0]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </article>

      <RiskList
        title="Overdue maintenance"
        emptyHint="No overdue maintenance for this scope."
        items={compliance.overdueMaintenance.map((task) => ({
          key: task.id,
          line: `${task.title} · due ${task.dueDate}`
        }))}
      />
    </div>
  );
}

function DrillsDashboardSection({
  compliance,
  chartData,
  chartFills,
  drillsAccent,
  statusAccent
}: {
  compliance: ComplianceSummary;
  chartData: { name: string; value: number }[];
  chartFills: string[];
  drillsAccent: MetricCardAccent;
  statusAccent: MetricCardAccent;
}) {
  const showAlert = compliance.missedDrills.length > 0;

  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
      {showAlert ? (
        <div className={`${styles.dashboardComplianceAlert} xl:col-span-4`} role="status">
          <p className="font-extrabold text-ink-heading dark:text-white">Drill alerts</p>
          <p className="mt-2 font-semibold">
            {compliance.missedDrills.length} missed or incomplete drill{" "}
            {compliance.missedDrills.length === 1 ? "event" : "events"} (past scheduled date).
          </p>
        </div>
      ) : null}

      <MetricCard accent={statusAccent} title="Fleet status" value={compliance.status} />
      <MetricCard
        accent="drills"
        scorePercent={compliance.drillParticipationPercent}
        title="Drill participation"
        value={`${compliance.drillParticipationPercent}%`}
      />
      <MetricCard accent="risk" title="Missed drills" value={String(compliance.missedDrills.length)} />
      <MetricCard
        accent="drills"
        title="Attendance slots"
        value={
          compliance.totalDrillAssignments === 0 ? "—" : `${compliance.attendedDrillAssignments} / ${compliance.totalDrillAssignments}`
        }
      />

      <article className={`${styles.dashboardPanel} ${metricCardAccentClass[drillsAccent]} xl:col-span-2`}>
        <h3 className="mb-3 text-sm font-extrabold text-ink-heading">Drills vs fleet overall (%)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--palette-border-light)" />
            <XAxis dataKey="name" stroke="var(--palette-text-muted)" tick={{ fill: "var(--palette-text-muted)", fontSize: 11 }} />
            <YAxis domain={[0, 100]} stroke="var(--palette-text-muted)" tick={{ fill: "var(--palette-text-muted)", fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: "var(--radius-sm)", borderColor: "var(--palette-border-light)" }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={chartFills[index] ?? chartFills[0]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </article>

      <RiskList
        title="Missed drills"
        emptyHint="No missed drills for this scope."
        items={compliance.missedDrills.map((drill) => ({
          key: drill.id,
          line: `${drill.type} · scheduled ${drill.scheduledDate}`
        }))}
      />
    </div>
  );
}

function MetricCard({
  title,
  value,
  accent = "neutral",
  scorePercent
}: {
  title: string;
  value: string;
  accent?: MetricCardAccent;
  scorePercent?: number;
}) {
  const valueClass = scorePercent !== undefined ? complianceScoreTextClass(scorePercent) : "text-ink-heading";
  return (
    <article className={`${styles.dashboardPanel} ${metricCardAccentClass[accent]}`}>
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">{title}</span>
      <strong className={`text-xl font-extrabold ${valueClass}`}>{value}</strong>
    </article>
  );
}

function RiskList({
  title,
  emptyHint,
  items
}: {
  title: string;
  emptyHint: string;
  items: { key: string; line: string }[];
}) {
  return (
    <article className={`${styles.dashboardPanel} xl:col-span-2`}>
      <h3 className="mb-2 text-sm font-extrabold text-ink-heading">{title}</h3>
      {items.length === 0 ? <p className="text-sm font-semibold text-ink-body">{emptyHint}</p> : null}
      <div className="grid gap-2">
        {items.map((item) => (
          <p
            className="rounded-[var(--radius-sm)] border-l-4 border-l-danger bg-danger-light px-3 py-2 text-sm font-semibold text-danger-dark dark:bg-danger/15 dark:text-red-100"
            key={item.key}
          >
            {item.line}
          </p>
        ))}
      </div>
    </article>
  );
}
