import { AlertTriangle, CheckCircle2, CloudOff, LoaderCircle, Power, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const styles = {
  HEALTHY: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  WARNING: "border-amber-500/30 bg-amber-500/10 text-amber-100",
  CRITICAL: "border-red-500/30 bg-red-500/10 text-red-100",
  CALIBRATING: "border-violet-500/30 bg-violet-500/10 text-violet-100",
  OFFLINE: "border-slate-500/30 bg-slate-500/10 text-slate-200",
  CONNECTING: "border-sky-500/30 bg-sky-500/10 text-sky-100",
};
const icons = { HEALTHY: CheckCircle2, WARNING: AlertTriangle, CRITICAL: ShieldAlert, CALIBRATING: LoaderCircle, OFFLINE: CloudOff, CONNECTING: Power };

export function StatusBanner({ current, isOffline, loading }) {
  const raw = loading ? "CONNECTING" : isOffline ? "OFFLINE" : current?.device_status === "CALIBRATING" ? "CALIBRATING" : String(current?.prediction ?? current?.device_status ?? "OFFLINE").toUpperCase();
  const status = ["HEALTHY", "WARNING", "CRITICAL", "CALIBRATING", "OFFLINE", "CONNECTING"].includes(raw) ? raw : "CONNECTING";
  const Icon = icons[status];
  const progress = Number(current?.calibration_progress ?? 0);
  return (
    <section className={`rounded-2xl border p-5 md:p-6 ${styles[status]}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-current/20 bg-black/10 p-3"><Icon className={`h-7 w-7 ${status === "CALIBRATING" || status === "CONNECTING" ? "animate-spin" : ""}`} /></div>
          <div><p className="text-xs font-semibold uppercase tracking-[.22em] opacity-70">System state</p><h2 className="mt-1 text-2xl font-bold">{status.replace("_", " ")}</h2><p className="mt-1 text-sm opacity-80">{status === "CALIBRATING" ? "Keep the unit stable while sensors establish a baseline." : status === "CRITICAL" ? "Critical anomaly detected. Fan shutdown protection is active." : status === "OFFLINE" ? "No recent heartbeat received from the ESP32." : "Live AHU condition monitoring is active."}</p></div>
        </div>
        <Badge variant="outline" className="w-fit border-current/30 bg-black/10 px-3 py-1 text-current">AHU-01</Badge>
      </div>
      {status === "CALIBRATING" && <div className="mt-5"><div className="mb-2 flex justify-between text-xs"><span>Calibration progress</span><span>{progress}%</span></div><Progress value={progress} className="bg-black/20" indicatorClassName="bg-violet-300" /></div>}
    </section>
  );
}
