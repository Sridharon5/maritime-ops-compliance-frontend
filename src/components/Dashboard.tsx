import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { styles } from "../constants";
import type { ComplianceSummary } from "../types";

type MetricTone = "good" | "risk";

export function Dashboard({ compliance }: { compliance: ComplianceSummary }) {
  const chartData = [
    { name: "Maintenance", value: compliance.maintenanceCompletionPercent },
    { name: "Drills", value: compliance.drillParticipationPercent },
    { name: "Overall", value: compliance.overallCompliancePercent }
  ];

  return (
    <section className="grid gap-4 lg:grid-cols-4">
      <MetricCard title="Compliance Status" value={compliance.status} tone={compliance.status === "Compliant" ? "good" : "risk"} />
      <MetricCard title="Maintenance Complete" value={`${compliance.maintenanceCompletionPercent}%`} />
      <MetricCard title="Drill Participation" value={`${compliance.drillParticipationPercent}%`} />
      <MetricCard title="Open Risks" value={`${compliance.overdueMaintenance.length + compliance.missedDrills.length}`} tone="risk" />

      <article className={`${styles.panel} lg:col-span-2`}>
        <h2 className="mb-4 text-xl font-extrabold">Compliance Chart</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="value" fill="#0f766e" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </article>

      <RiskList compliance={compliance} />
    </section>
  );
}

function MetricCard({ title, value, tone }: { title: string; value: string; tone?: MetricTone }) {
  const borderColor = tone === "good" ? "border-emerald-400" : tone === "risk" ? "border-rose-400" : "border-slate-200";

  return (
    <article className={`${styles.panel} ${borderColor}`}>
      <span className="mb-2 block text-sm font-bold text-slate-500">{title}</span>
      <strong className="text-3xl font-extrabold text-slate-950">{value}</strong>
    </article>
  );
}

function RiskList({ compliance }: { compliance: ComplianceSummary }) {
  const hasRisks = compliance.overdueMaintenance.length > 0 || compliance.missedDrills.length > 0;

  return (
    <article className={`${styles.panel} lg:col-span-2`}>
      <h2 className="mb-4 text-xl font-extrabold">Risk Notifications</h2>
      {!hasRisks && <p className="text-slate-600">No overdue or missed items.</p>}
      <div className="grid gap-3">
        {compliance.overdueMaintenance.map((task) => (
          <p className="rounded-xl border-l-4 border-rose-600 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-900" key={task.id}>
            Overdue maintenance: {task.title} due {task.dueDate}
          </p>
        ))}
        {compliance.missedDrills.map((drill) => (
          <p className="rounded-xl border-l-4 border-rose-600 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-900" key={drill.id}>
            Missed drill: {drill.type} scheduled {drill.scheduledDate}
          </p>
        ))}
      </div>
    </article>
  );
}
