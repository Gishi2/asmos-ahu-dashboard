const now = Date.now();

export const mockCurrent = {
  device_status: "MONITORING",
  prediction: "Healthy",
  confidence: 98.4,
  vibration_rms: 0.021,
  sound_rms: 45280,
  healthy_probability: 98.4,
  warning_probability: 1.3,
  critical_probability: 0.3,
  health_score: 98,
  relay_state: "ON",
  fan_state: "RUNNING",
  calibration_progress: 100,
  last_seen: now,
  firmware_version: "v2.0.0",
  uptime_ms: 3724000,
  ip_address: "192.168.1.42",
};

export const mockHistory = Array.from({ length: 24 }, (_, i) => {
  const drift = Math.sin(i / 3) * 4;
  return {
    timestamp: now - (23 - i) * 60000,
    label: new Date(now - (23 - i) * 60000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    health_score: Math.max(70, Math.min(100, Math.round(94 + drift))),
    vibration_rms: Number((0.02 + Math.sin(i / 2) * 0.004 + (i === 16 ? 0.018 : 0)).toFixed(3)),
    sound_rms: Math.round(44500 + Math.cos(i / 2.6) * 2200 + (i === 16 ? 9000 : 0)),
  };
});

export const mockAlerts = [
  { id: "a1", timestamp: now - 8 * 60000, level: "warning", message: "Elevated vibration detected", prediction: "Warning" },
  { id: "a2", timestamp: now - 26 * 60000, level: "info", message: "Calibration completed", prediction: "Healthy" },
  { id: "a3", timestamp: now - 45 * 60000, level: "critical", message: "Critical anomaly — fan stopped", prediction: "Critical" },
];
