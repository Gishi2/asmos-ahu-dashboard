import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export function HealthScore({ score = 0 }) {
  const safe = Math.max(0, Math.min(100, Number(score) || 0));
  const stroke = safe >= 80 ? "stroke-emerald-400" : safe >= 50 ? "stroke-amber-400" : "stroke-red-400";
  const circumference = 2 * Math.PI * 52;
  return <Card className="border-white/10 bg-card/70"><CardHeader><CardTitle>Health score</CardTitle><CardDescription>Weighted score from model probabilities</CardDescription></CardHeader><CardContent className="flex items-center justify-center"><div className="relative h-44 w-44"><svg viewBox="0 0 120 120" className="h-full w-full -rotate-90"><circle cx="60" cy="60" r="52" fill="none" className="stroke-white/10" strokeWidth="10"/><circle cx="60" cy="60" r="52" fill="none" className={stroke} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - safe / 100)} /></svg><div className="absolute inset-0 grid place-items-center text-center"><div><div className="text-4xl font-bold">{Math.round(safe)}%</div><div className="text-xs text-muted-foreground">Overall condition</div></div></div></div></CardContent></Card>;
}
