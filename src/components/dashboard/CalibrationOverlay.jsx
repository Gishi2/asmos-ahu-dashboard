import {
  Activity,
  Check,
  Cpu,
  Gauge,
  LoaderCircle,
  Radio,
  ShieldCheck,
} from "lucide-react";

import { Progress } from "@/components/ui/progress";

function getCalibrationStage(progress) {
  if (progress < 20) {
    return {
      title: "Initializing vibration sensor",
      description:
        "Establishing communication with the MPU6050.",
    };
  }

  if (progress < 50) {
    return {
      title: "Sampling acceleration baseline",
      description:
        "Measuring the stable gravity and sensor offset.",
    };
  }

  if (progress < 80) {
    return {
      title: "Filtering sensor noise",
      description:
        "Calculating a clean vibration reference level.",
    };
  }

  if (progress < 100) {
    return {
      title: "Validating calibration",
      description:
        "Finalizing the baseline for TinyML inference.",
    };
  }

  return {
    title: "Calibration complete",
    description:
      "Starting live AI health monitoring.",
  };
}

function CalibrationStep({
  icon: Icon,
  title,
  complete,
  active,
}) {
  return (
    <div
      className={[
        "flex items-center gap-3 rounded-xl border px-4 py-3 transition-all",
        complete
          ? "border-emerald-500/30 bg-emerald-500/10"
          : active
            ? "border-cyan-400/40 bg-cyan-400/10"
            : "border-slate-800 bg-slate-950/40",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-9 w-9 items-center justify-center rounded-lg",
          complete
            ? "bg-emerald-500/15 text-emerald-300"
            : active
              ? "bg-cyan-400/15 text-cyan-300"
              : "bg-slate-800 text-slate-500",
        ].join(" ")}
      >
        {complete ? (
          <Check className="h-5 w-5" />
        ) : (
          <Icon
            className={[
              "h-5 w-5",
              active ? "animate-pulse" : "",
            ].join(" ")}
          />
        )}
      </div>

      <div className="min-w-0">
        <p
          className={[
            "text-sm font-medium",
            complete
              ? "text-emerald-200"
              : active
                ? "text-cyan-100"
                : "text-slate-500",
          ].join(" ")}
        >
          {title}
        </p>

        <p className="text-xs text-slate-500">
          {complete
            ? "Completed"
            : active
              ? "In progress"
              : "Waiting"}
        </p>
      </div>
    </div>
  );
}

export function CalibrationOverlay({
  current,
}) {
  const deviceState = String(
    current?.device_status ?? "",
  ).toUpperCase();

  if (deviceState !== "CALIBRATING") {
    return null;
  }

  const progress = Math.min(
    100,
    Math.max(
      0,
      Number(
        current?.calibration_progress ?? 0,
      ),
    ),
  );

  const stage =
    getCalibrationStage(progress);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/90 px-4 py-8 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-900/95 shadow-2xl shadow-cyan-950/40">
        <div className="border-b border-slate-800 bg-slate-950/40 px-6 py-5 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10">
                <Activity className="h-6 w-6 text-cyan-300" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                  ASMoS initialization
                </p>

                <h2 className="mt-1 text-xl font-semibold text-slate-50">
                  Sensor Calibration
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-200">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              AHU-01 connected
            </div>
          </div>
        </div>

        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[240px_1fr]">
          <div className="flex flex-col items-center justify-center">
            <div className="relative flex h-52 w-52 items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-cyan-400/10" />

              <div className="absolute inset-3 animate-[spin_8s_linear_infinite] rounded-full border border-dashed border-cyan-400/30" />

              <div className="absolute inset-7 animate-[spin_5s_linear_infinite_reverse] rounded-full border border-dashed border-emerald-400/20" />

              <div
                className="absolute inset-5 rounded-full"
                style={{
                  background: `conic-gradient(
                    #22d3ee ${progress * 3.6}deg,
                    rgba(30, 41, 59, 0.7) 0deg
                  )`,
                }}
              />

              <div className="absolute inset-8 flex flex-col items-center justify-center rounded-full bg-slate-950 shadow-inner">
                {progress < 100 ? (
                  <LoaderCircle className="mb-2 h-6 w-6 animate-spin text-cyan-300" />
                ) : (
                  <ShieldCheck className="mb-2 h-7 w-7 text-emerald-300" />
                )}

                <span className="text-4xl font-bold tracking-tight text-white">
                  {Math.round(progress)}%
                </span>

                <span className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                  calibrated
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
              <Gauge className="h-4 w-4 text-cyan-300" />
              MPU6050 baseline acquisition
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div>
              <p className="text-sm font-medium text-cyan-300">
                {stage.title}
              </p>

              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                Keep the AHU and sensor completely still
              </h3>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                {stage.description} The fan will start automatically when calibration and sensor initialization are complete.
              </p>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Calibration progress
                </span>

                <span className="font-medium text-cyan-200">
                  {Math.round(progress)} / 100
                </span>
              </div>

              <Progress
                value={progress}
                className="h-2.5 bg-slate-800"
              />
            </div>

            <div className="mt-6 grid gap-3">
              <CalibrationStep
                icon={Radio}
                title="Device and Firebase connection"
                complete={progress >= 10}
                active={progress < 10}
              />

              <CalibrationStep
                icon={Gauge}
                title="MPU6050 baseline calibration"
                complete={progress >= 100}
                active={
                  progress >= 10 &&
                  progress < 100
                }
              />

              <CalibrationStep
                icon={Cpu}
                title="TinyML monitoring initialization"
                complete={false}
                active={progress >= 100}
              />
            </div>

            <p className="mt-5 text-center text-xs text-slate-500 sm:text-left">
              Do not move, touch or shake the enclosure during this process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}