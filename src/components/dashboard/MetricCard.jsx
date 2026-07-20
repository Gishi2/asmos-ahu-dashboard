import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export function MetricCard({ title, value, unit, icon: Icon, hint }) {
  return <Card className="border-white/10 bg-card/70 backdrop-blur"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>{Icon && <Icon className="h-4 w-4 text-cyan-300" />}</CardHeader><CardContent><div className="text-2xl font-bold tracking-tight">{value}<span className="ml-1 text-sm font-medium text-muted-foreground">{unit}</span></div>{hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}</CardContent></Card>;
}
