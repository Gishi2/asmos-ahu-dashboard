# ASMoS AHU Dashboard

React + Vite dashboard using shadcn/ui-style components, Tailwind CSS, Firebase Realtime Database, Recharts and Lucide icons.

## Quick start

```bash
npm install
npm run dev
```

The dashboard starts in **demo mode** so you can inspect the design immediately.

## Connect Firebase

1. Copy `.env.example` to `.env.local`.
2. In Firebase Console, open **Project settings → General → Your apps → SDK setup and configuration**.
3. Fill in all `VITE_FIREBASE_*` values.
4. Restart the development server.

Expected Firebase paths:

```text
devices/ahu_01/current
devices/ahu_01/history
devices/ahu_01/alerts
```

The current record can contain:

```json
{
  "device_status": "MONITORING",
  "prediction": "Healthy",
  "confidence": 98.4,
  "vibration_rms": 0.021,
  "sound_rms": 45280,
  "healthy_probability": 98.4,
  "warning_probability": 1.3,
  "critical_probability": 0.3,
  "health_score": 98,
  "relay_state": "ON",
  "fan_state": "RUNNING",
  "calibration_progress": 100,
  "last_seen": 1784500000000,
  "firmware_version": "v2.0.0",
  "uptime_ms": 3724000,
  "ip_address": "192.168.1.42"
}
```

## Build for Vercel

```bash
npm run build
```

Import the GitHub repository into Vercel and add the same environment variables under **Project Settings → Environment Variables**.

## Important

The current Firebase test rules may allow public reads/writes. Replace them with authenticated rules before final deployment.
