import { CalibrationOverlay } from "@/components/dashboard/CalibrationOverlay";
import { Activity, Fan, Gauge, Radio, RotateCcw, Volume2, Wifi } from "lucide-react";
import { useAhuData } from "@/hooks/useAhuData";
import { StatusBanner } from "@/components/dashboard/StatusBanner";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { HealthScore } from "@/components/dashboard/HealthScore";
import { ProbabilityCard } from "@/components/dashboard/ProbabilityCard";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { AlertsTable } from "@/components/dashboard/AlertsTable";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
  import { Separator } from "@/components/ui/separator";

function formatUptime(ms = 0) { const total=Math.floor(Number(ms)/1000); const h=Math.floor(total/3600); const m=Math.floor((total%3600)/60); return `${h}h ${m}m`; }

export default function App() {
  const { current, history, alerts, loading, error, source, isOffline } = useAhuData();
  return <div className="min-h-screen bg-background text-foreground">
    <CalibrationOverlay current={current} />
    <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.09),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,.08),transparent_32%)]" />
    <main className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.22em] text-cyan-300"><Activity className="h-4 w-4"/> ASMoS</div><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">AHU Safety Monitoring</h1><p className="mt-1 text-sm text-muted-foreground">TinyML anomaly detection and automatic fan protection</p></div>
        <div className="flex items-center gap-2"><Badge variant="outline" className="gap-1.5 border-white/10 bg-white/[.03] px-3 py-1.5"><Wifi className="h-3.5 w-3.5"/>{source === "firebase"
  ? "Firebase live"
  : source === "connecting"
    ? "Connecting..."
    : source === "error"
      ? "Firebase error"
      : "Firebase not configured"}</Badge><Badge variant="outline" className="border-white/10 bg-white/[.03] px-3 py-1.5">{new Date().toLocaleDateString()}</Badge></div>
      </header>

      {error && <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100">Firebase connection failed: {error}.</div>}
      <StatusBanner current={current} isOffline={isOffline} loading={loading} />

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="grid w-full grid-cols-3 sm:w-auto"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="trends">Trends</TabsTrigger><TabsTrigger value="device">Device</TabsTrigger></TabsList>
        <TabsContent value="overview" className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Vibration" value={Number(current?.vibration_rms ?? 0).toFixed(3)} unit="RMS" icon={Gauge} hint="MPU6050 acceleration magnitude"/>
            <MetricCard title="Sound" value={Math.round(Number(current?.sound_rms ?? 0)).toLocaleString()} unit="RMS" icon={Volume2} hint="INMP441 audio energy"/>
            <MetricCard title="Fan state" value={current?.fan_state ?? "UNKNOWN"} icon={Fan} hint={`Relay: ${current?.relay_state ?? "-"}`}/>
            <MetricCard title="Model confidence" value={Number(current?.confidence ?? current?.healthy_probability ?? 0).toFixed(1)} unit="%" icon={Radio} hint={`Prediction: ${current?.prediction ?? "Unknown"}`}/>
          </section>
          <section className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]"><HealthScore score={current?.health_score}/><ProbabilityCard current={current}/></section>
          <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]"><TrendChart history={history}/><AlertsTable alerts={alerts}/></section>
        </TabsContent>
        <TabsContent value="trends"><TrendChart history={history}/></TabsContent>
        <TabsContent value="device">
          <Card className="border-white/10 bg-card/70"><CardHeader><CardTitle>Device information</CardTitle></CardHeader><CardContent className="space-y-4 text-sm">
            {[ ["Device ID","AHU-01"], ["Firmware",current?.firmware_version ?? "-"], ["IP address",current?.ip_address ?? "-"], ["Uptime",formatUptime(current?.uptime_ms)], ["Last seen", current?.last_seen ? new Date(Number(current.last_seen)).toLocaleString() : "-"], ["Database source", source] ].map(([k,v],i)=><div key={k}>{i>0&&<Separator className="mb-4"/>}<div className="flex justify-between gap-6"><span className="text-muted-foreground">{k}</span><span className="text-right font-medium">{v}</span></div></div>)}
          </CardContent></Card>
        </TabsContent>
      </Tabs>
      <footer className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>ASMoS — AHU Safety Monitoring System</span><span className="flex items-center gap-1.5"><RotateCcw className="h-3.5 w-3.5"/> Realtime updates enabled</span></footer>
    </main>
  </div>;
}
