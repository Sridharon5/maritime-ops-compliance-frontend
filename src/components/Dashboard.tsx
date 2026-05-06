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

const chartFills = [
  "var(--palette-chart-maintenance)",
  "var(--palette-chart-drills)",
  "var(--palette-chart-overall)"
];

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

  const chartData = compliance
    ? [
        { name: "Maintenance", value: compliance.maintenanceCompletionPercent },
        { name: "Drills", value: compliance.drillParticipationPercent },
        { name: "Overall", value: compliance.overallCompliancePercent }
      ]
    : [];

  const focusedRisks = useMemo(() => {
    if (!compliance) return [];
    return focusMode === "maintenance" ? compliance.overdueMaintenance : compliance.missedDrills;
  }, [compliance, focusMode]);

  const statusAccent = useMemo((): MetricCardAccent => {
    if (!compliance) return "neutral";
    if (compliance.status === "Compliant") return "compliance";
    if (compliance.status === "At Risk") return "atRisk";
    return "risk";
  }, [compliance]);

  const overallAccent = useMemo((): MetricCardAccent => {
    if (!compliance) return "neutral";
    const v = compliance.overallCompliancePercent;
    if (v >= 90) return "compliance";
    if (v >= 70) return "atRisk";
    return "risk";
  }, [compliance]);

  return (
    <section>
      <div className={styles.pageHeadingRow}>
        <div className={styles.pageHeadingCluster}>
          <span className={styles.pageHeadingAccent} aria-hidden />
          <h2 className={styles.pageHeadingTitle}>Compliance Dashboard</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className={focusMode === "maintenance" ? styles.toolbarPrimaryButton : styles.toolbarGhostButton} type="button" onClick={() => setFocusMode("maintenance")}>Maintenance</button>
          <button className={focusMode === "drills" ? styles.toolbarPrimaryButton : styles.toolbarGhostButton} type="button" onClick={() => setFocusMode("drills")}>Drills</button>
          <ShipFilterSelect ships={ships} value={shipId} onChange={setShipId} />
        </div>
      </div>

      {!compliance && !loadError ? <p className="text-sm font-semibold text-ink-muted">Loading compliance…</p> : null}
      {loadError ? <p className="text-sm font-semibold text-danger-dark">{loadError}</p> : null}

      {compliance ? (
        <div className="grid gap-3 lg:grid-cols-4">
          <MetricCard accent={statusAccent} title="Status" value={compliance.status} />
          <MetricCard accent="maintenance" scorePercent={compliance.maintenanceCompletionPercent} title="Maintenance %" value={`${compliance.maintenanceCompletionPercent}%`} />
          <MetricCard accent="drills" scorePercent={compliance.drillParticipationPercent} title="Drills %" value={`${compliance.drillParticipationPercent}%`} />
          <MetricCard accent="risk" title="Open risks" value={`${compliance.overdueMaintenance.length + compliance.missedDrills.length}`} />

          <article className={`${styles.dashboardPanel} ${metricCardAccentClass[overallAccent]} lg:col-span-2`}>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--palette-border-light)" />
                <XAxis dataKey="name" stroke="var(--palette-text-muted)" tick={{ fill: "var(--palette-text-muted)", fontSize: 12 }} />
                <YAxis domain={[0, 100]} stroke="var(--palette-text-muted)" tick={{ fill: "var(--palette-text-muted)", fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: "var(--radius-sm)", borderColor: "var(--palette-border-light)" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={entry.name} fill={chartFills[index] ?? chartFills[0]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </article>

          <RiskList compliance={compliance} focusMode={focusMode} focusedRisks={focusedRisks} />
        </div>
      ) : null}
    </section>
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
  compliance,
  focusMode,
  focusedRisks
}: {
  compliance: ComplianceSummary;
  focusMode: FocusMode;
  focusedRisks: ComplianceSummary["overdueMaintenance"] | ComplianceSummary["missedDrills"];
}) {
  const hasAnyRisk = compliance.overdueMaintenance.length > 0 || compliance.missedDrills.length > 0;
  const title = focusMode === "maintenance" ? "Overdue Maintenance" : "Missed Drills";

  return (
    <article className={`${styles.dashboardPanel} lg:col-span-2`}>
      <h3 className="mb-2 text-sm font-extrabold text-ink-heading">{title}</h3>
      {!hasAnyRisk && <p className="text-sm font-semibold text-ink-body">No overdue or missed items.</p>}
      <div className="grid gap-2">
        {focusMode === "maintenance"
          ? (focusedRisks as ComplianceSummary["overdueMaintenance"]).map((task) => (
              <p className="rounded-[var(--radius-sm)] border-l-4 border-l-danger bg-danger-light px-3 py-2 text-sm font-semibold text-danger-dark" key={task.id}>
                {task.title} due {task.dueDate}
              </p>
            ))
          : (focusedRisks as ComplianceSummary["missedDrills"]).map((drill) => (
              <p className="rounded-[var(--radius-sm)] border-l-4 border-l-danger bg-danger-light px-3 py-2 text-sm font-semibold text-danger-dark" key={drill.id}>
                {drill.type} scheduled {drill.scheduledDate}
              </p>
            ))}
      </div>
    </article>
  );
}
