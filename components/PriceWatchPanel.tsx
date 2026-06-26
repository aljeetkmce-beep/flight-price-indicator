"use client";

import { useState, useEffect, useCallback } from "react";
import { AirportInput } from "@/components/AirportInput";

// ── Types ──────────────────────────────────────────────────────────────────
interface Watch {
  id: number;
  origin: string;
  destination: string;
  travelDate: string;
  maxStops: number | null;
  maxLayoverHours: number | null;
  monitoringStartDate: string;
  checkTime: string;
  alertType: string;
  thresholdPrice: number | null;
  email: string;
  whatsapp: string | null;
  status: string;
  currentFare: number | null;
  lowestFareSeen: number | null;
  highestFareSeen: number | null;
  lastCheckedAt: string | null;
  createdAt: string;
}

interface PriceHistoryEntry {
  id: number;
  watchId: number;
  dateChecked: string;
  fare: number;
  currency: string;
  createdAt: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function rupees(n: number | null | undefined): string {
  if (n == null) return "—";
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function fmtDate(d: string): string {
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fmtDateTime(s: string | null): string {
  if (!s) return "—";
  return new Date(s).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

const INPUT_CLS =
  "w-full rounded-xl border border-premium-border bg-black/40 px-4 py-3.5 text-sm text-white placeholder-premium-muted/40 transition-all duration-200 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/10";

// ── Price history sparkline ────────────────────────────────────────────────
function SparklineChart({ history }: { history: PriceHistoryEntry[] }) {
  if (history.length < 2) {
    return (
      <p className="py-6 text-center text-xs text-premium-muted/40">
        {history.length === 0 ? "No price history yet." : "Need at least 2 data points."}
      </p>
    );
  }

  const ML = 52, MR = 16, MT = 20, MB = 48;
  const CHART_W = 500, CHART_H = 110;
  const SVG_W = ML + CHART_W + MR;
  const SVG_H = MT + CHART_H + MB;

  const fares = history.map((h) => h.fare);
  const minFare = Math.min(...fares);
  const maxFare = Math.max(...fares);
  const range = maxFare - minFare || 1;

  function px(i: number): number {
    return ML + (i / (history.length - 1)) * CHART_W;
  }
  function py(fare: number): number {
    return MT + CHART_H - ((fare - minFare) / range) * CHART_H;
  }

  const points = history.map((h, i) => `${px(i)},${py(h.fare)}`).join(" ");
  const areaPoints = [
    `${ML},${MT + CHART_H}`,
    ...history.map((h, i) => `${px(i)},${py(h.fare)}`),
    `${ML + CHART_W},${MT + CHART_H}`,
  ].join(" ");

  const gridFares = [minFare, (minFare + maxFare) / 2, maxFare];

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width={SVG_W}
        height={SVG_H}
        style={{ minWidth: "300px", maxWidth: "100%" }}
        className="block"
      >
        {gridFares.map((f, i) => {
          const y = py(f);
          return (
            <g key={i}>
              <line x1={ML} y1={y} x2={ML + CHART_W} y2={y} stroke="#2A2A2A" strokeWidth="1" />
              <text x={ML - 4} y={y + 4} textAnchor="end" fill="#A0A0A0" fontSize="9">
                ₹{Math.round(f / 1000)}k
              </text>
            </g>
          );
        })}
        <line x1={ML} y1={MT} x2={ML} y2={MT + CHART_H} stroke="#2A2A2A" strokeWidth="1" />
        <line x1={ML} y1={MT + CHART_H} x2={ML + CHART_W} y2={MT + CHART_H} stroke="#2A2A2A" strokeWidth="1" />

        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#areaGrad)" />
        <polyline points={points} fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinejoin="round" />

        {history.map((h, i) => {
          const x = px(i);
          const y = py(h.fare);
          const showLabel =
            history.length <= 10 || i % Math.ceil(history.length / 10) === 0 || i === history.length - 1;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="3" fill="#D4AF37" />
              {showLabel && (
                <text
                  x={x}
                  y={MT + CHART_H + 14}
                  textAnchor="middle"
                  fill="#A0A0A0"
                  fontSize="8"
                  transform={`rotate(-30 ${x} ${MT + CHART_H + 14})`}
                >
                  {h.dateChecked.slice(5)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Stat pill ──────────────────────────────────────────────────────────────
function StatPill({
  label,
  value,
  color = "text-white",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-premium-border/50 bg-black/20 p-3">
      <p className="mb-1 text-[10px] font-medium uppercase tracking-widest text-premium-muted/60">{label}</p>
      <p className={`text-base font-bold ${color}`}>{value}</p>
    </div>
  );
}

// ── Watch card ─────────────────────────────────────────────────────────────
function WatchCard({
  watch,
  onStatusChange,
  onDelete,
  onCheckNow,
}: {
  watch: Watch;
  onStatusChange: (id: number, status: "active" | "paused") => void;
  onDelete: (id: number) => void;
  onCheckNow: (id: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [history, setHistory] = useState<PriceHistoryEntry[]>([]);
  const [histLoading, setHistLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function loadHistory() {
    if (history.length > 0) {
      setExpanded((e) => !e);
      return;
    }
    setExpanded(true);
    setHistLoading(true);
    try {
      const res = await fetch(`/api/watch/${watch.id}/history`);
      const data = await res.json();
      if (data.success) setHistory(data.history);
    } finally {
      setHistLoading(false);
    }
  }

  async function handleCheckNow() {
    setChecking(true);
    await onCheckNow(watch.id);
    setChecking(false);
    setHistory([]);
    setExpanded(false);
  }

  async function handleDelete() {
    if (!confirm(`Delete watch for ${watch.origin} → ${watch.destination} on ${watch.travelDate}?`)) return;
    setDeleting(true);
    await onDelete(watch.id);
  }

  const isActive = watch.status === "active";
  const hasFare = watch.currentFare !== null;

  const alertTypeLabel =
    watch.alertType === "below_threshold"
      ? "Below Threshold"
      : watch.alertType === "new_lowest"
      ? "New Lowest"
      : "Both";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border transition-all duration-200 ${
        isActive
          ? "border-premium-border bg-premium-card hover:border-gold/20"
          : "border-premium-border/50 bg-premium-card/50 opacity-70"
      }`}
    >
      {isActive && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      )}

      <div className="p-5">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  isActive
                    ? "border-success/30 bg-success/10 text-success"
                    : "border-premium-border bg-premium-hover text-premium-muted"
                }`}
              >
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${isActive ? "bg-success" : "bg-premium-muted"}`}
                />
                {isActive ? "Active" : "Paused"}
              </span>
              <span className="text-xs text-premium-muted">{watch.checkTime} daily</span>
            </div>
            <h3 className="mt-2 font-mono text-lg font-bold text-white">
              {watch.origin} → {watch.destination}
            </h3>
            <p className="text-sm text-premium-muted">{fmtDate(watch.travelDate)}</p>
          </div>
          {hasFare && (
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wide text-premium-muted">Current</p>
              <p className="text-2xl font-bold text-gold">{rupees(watch.currentFare)}</p>
            </div>
          )}
        </div>

        {/* Fare stats */}
        <div className="mb-4 grid grid-cols-3 gap-2">
          <StatPill label="Current" value={rupees(watch.currentFare)} color="text-gold" />
          <StatPill label="Lowest" value={rupees(watch.lowestFareSeen)} color="text-success" />
          <StatPill label="Highest" value={rupees(watch.highestFareSeen)} color="text-danger" />
        </div>

        {/* Alert info */}
        <div className="mb-4 flex flex-wrap gap-2 text-xs text-premium-muted">
          <span className="flex items-center gap-1.5 rounded-lg border border-premium-border/50 bg-black/20 px-2.5 py-1">
            <span className="text-gold">◉</span>
            Alert: {alertTypeLabel}
          </span>
          {watch.thresholdPrice && (
            <span className="flex items-center gap-1.5 rounded-lg border border-gold/20 bg-gold/8 px-2.5 py-1 text-gold">
              Threshold: {rupees(watch.thresholdPrice)}
            </span>
          )}
          {watch.maxStops !== null && (
            <span className="rounded-lg border border-premium-border/50 bg-black/20 px-2.5 py-1">
              Max {watch.maxStops} stop{watch.maxStops !== 1 ? "s" : ""}
            </span>
          )}
          {watch.maxLayoverHours && (
            <span className="rounded-lg border border-premium-border/50 bg-black/20 px-2.5 py-1">
              ≤{watch.maxLayoverHours}h layover
            </span>
          )}
        </div>

        {/* Last checked */}
        <p className="mb-4 text-[11px] text-premium-muted/50">
          Last checked: {fmtDateTime(watch.lastCheckedAt)} · {watch.email}
        </p>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 border-t border-premium-border/50 pt-4">
          <button
            onClick={handleCheckNow}
            disabled={checking || !isActive}
            className="flex items-center gap-1.5 rounded-lg border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold transition-all hover:bg-gold/15 disabled:opacity-40"
          >
            {checking ? (
              <span className="h-3 w-3 animate-spin rounded-full border border-gold/30 border-t-gold" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                <path fillRule="evenodd" d="M13.836 2.477a.75.75 0 0 1 .75.75v3.182a.75.75 0 0 1-.75.75h-3.182a.75.75 0 0 1 0-1.5h1.37l-.84-.841a4.5 4.5 0 0 0-7.08.932.75.75 0 0 1-1.3-.75 6 6 0 0 1 9.44-1.242l.842.84V3.227a.75.75 0 0 1 .75-.75Zm-.911 7.5A.75.75 0 0 1 13.199 11a6 6 0 0 1-9.44 1.241l-.84-.84v1.371a.75.75 0 0 1-1.5 0V9.591a.75.75 0 0 1 .75-.75H5.35a.75.75 0 0 1 0 1.5H3.98l.841.841a4.5 4.5 0 0 0 7.08-.932.75.75 0 0 1 1.025-.273Z" clipRule="evenodd" />
              </svg>
            )}
            {checking ? "Checking…" : "Check Now"}
          </button>

          <button
            onClick={() => onStatusChange(watch.id, isActive ? "paused" : "active")}
            className="rounded-lg border border-premium-border px-3 py-1.5 text-xs font-semibold text-premium-muted transition-all hover:border-gold/30 hover:text-gold"
          >
            {isActive ? "Pause" : "Resume"}
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg border border-danger/20 px-3 py-1.5 text-xs font-semibold text-danger/70 transition-all hover:border-danger/40 hover:bg-danger/8 hover:text-danger disabled:opacity-40"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>

          {hasFare && (
            <button
              onClick={loadHistory}
              className="ml-auto rounded-lg border border-premium-border px-3 py-1.5 text-xs font-medium text-premium-muted transition-all hover:border-gold/20 hover:text-white"
            >
              {expanded ? "▲ Hide Chart" : "▼ Price History"}
            </button>
          )}
        </div>
      </div>

      {/* Expanded history */}
      {expanded && (
        <div className="border-t border-premium-border/50 bg-black/20 px-5 py-4">
          {histLoading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-xs text-premium-muted">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-premium-border border-t-gold" />
              Loading history…
            </div>
          ) : (
            <>
              <SparklineChart history={history} />
              {history.length > 0 && (
                <p className="mt-1 text-right text-[11px] text-premium-muted/40">
                  {history.length} data point{history.length !== 1 ? "s" : ""} tracked
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main panel ─────────────────────────────────────────────────────────────
export function PriceWatchPanel() {
  // Create watch form state
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [maxStops, setMaxStops] = useState<string>("any");
  const [maxLayoverHours, setMaxLayoverHours] = useState<string>("");
  const [checkTime, setCheckTime] = useState("09:00");
  const [alertType, setAlertType] = useState<"below_threshold" | "new_lowest" | "both">("both");
  const [thresholdPrice, setThresholdPrice] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);

  // Dashboard state
  const [watches, setWatches] = useState<Watch[]>([]);
  const [loading, setLoading] = useState(false);
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const today = todayStr();
    setMinDate(today);
    const depart = new Date();
    depart.setDate(depart.getDate() + 30);
    setTravelDate(depart.toISOString().split("T")[0]);
    loadWatches();
  }, []);

  const loadWatches = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/watch");
      const data = await res.json();
      if (data.success) setWatches(data.watches);
    } finally {
      setLoading(false);
    }
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[A-Z]{3}$/.test(origin)) { setCreateError("Origin must be a 3-letter IATA code."); return; }
    if (!/^[A-Z]{3}$/.test(destination)) { setCreateError("Destination must be a 3-letter IATA code."); return; }
    if (origin === destination) { setCreateError("Origin and destination must differ."); return; }
    if (!travelDate) { setCreateError("Travel date is required."); return; }
    if (!email) { setCreateError("Email is required for alerts."); return; }
    if ((alertType === "below_threshold" || alertType === "both") && !thresholdPrice) {
      setCreateError("Threshold price is required for this alert type."); return;
    }

    setSubmitting(true); setCreateError(null); setCreateSuccess(false);
    try {
      const res = await fetch("/api/watch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin,
          destination,
          travelDate,
          maxStops: maxStops === "any" ? null : parseInt(maxStops, 10),
          maxLayoverHours: maxLayoverHours ? parseFloat(maxLayoverHours) : null,
          monitoringStartDate: todayStr(),
          checkTime,
          alertType,
          thresholdPrice: thresholdPrice ? parseFloat(thresholdPrice) : null,
          email,
          whatsapp: whatsapp || null,
        }),
      });
      const data = await res.json();
      if (!data.success) { setCreateError(data.error ?? "Failed to create watch."); }
      else {
        setCreateSuccess(true);
        await loadWatches();
        setOrigin(""); setDestination(""); setThresholdPrice(""); setWhatsapp("");
      }
    } catch {
      setCreateError("Network error. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(id: number, status: "active" | "paused") {
    await fetch(`/api/watch/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setWatches((prev) => prev.map((w) => (w.id === id ? { ...w, status } : w)));
  }

  async function handleDelete(id: number) {
    await fetch(`/api/watch/${id}`, { method: "DELETE" });
    setWatches((prev) => prev.filter((w) => w.id !== id));
  }

  async function handleCheckNow(id: number) {
    await fetch("/api/scheduler/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ watchId: id }),
    });
    await loadWatches();
  }

  const needsThreshold = alertType === "below_threshold" || alertType === "both";

  return (
    <div className="space-y-6">
      {/* ── Hero intro ──────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-gold/25 bg-gradient-to-br from-[#1A190E] to-premium-card p-6">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/12">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-gold">
              <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
              <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Price Watch & Alerts</h2>
            <p className="mt-1 text-sm text-premium-muted">
              Monitor any route daily. Get an email alert when fares drop below your target.
            </p>
          </div>
        </div>
      </div>

      {/* ── Create watch form ────────────────────────────────────────────── */}
      <form onSubmit={handleCreate} className="rounded-2xl border border-premium-border bg-premium-card p-6">
        <h3 className="mb-1 text-lg font-bold text-white">Create Price Watch</h3>
        <p className="mb-6 text-sm text-premium-muted">Set up a route to monitor and configure your alert preferences</p>

        {/* Route */}
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-premium-muted">Route Details</p>
        <div className="mb-5 grid gap-4 sm:grid-cols-3">
          <AirportInput
            value={origin}
            onChange={setOrigin}
            label={<>Origin <span className="text-gold normal-case">*</span></>}
            placeholder="e.g. TRV or Trivandrum"
            required
          />
          <AirportInput
            value={destination}
            onChange={setDestination}
            label={<>Destination <span className="text-gold normal-case">*</span></>}
            placeholder="e.g. BKK or Bangkok"
            required
          />
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-premium-muted">
              Travel Date <span className="text-gold normal-case">*</span>
            </label>
            <input
              type="date"
              min={minDate}
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              required
              className={INPUT_CLS}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-premium-muted">
              Max Stops
            </label>
            <select
              value={maxStops}
              onChange={(e) => setMaxStops(e.target.value)}
              className={INPUT_CLS}
            >
              <option value="any">Any</option>
              <option value="0">Direct only</option>
              <option value="1">Up to 1 stop</option>
              <option value="2">Up to 2 stops</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-premium-muted">
              Max Layover Hours
            </label>
            <input
              type="number"
              min="0"
              max="48"
              step="0.5"
              value={maxLayoverHours}
              onChange={(e) => setMaxLayoverHours(e.target.value)}
              placeholder="e.g. 10"
              className={INPUT_CLS}
            />
          </div>
        </div>

        {/* Monitoring schedule */}
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-premium-muted">Monitoring Schedule</p>
        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-premium-muted">
              Daily Check Time <span className="text-gold normal-case">*</span>
            </label>
            <input
              type="time"
              value={checkTime}
              onChange={(e) => setCheckTime(e.target.value)}
              required
              className={INPUT_CLS}
            />
          </div>
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-premium-muted">
              Alert Type <span className="text-gold normal-case">*</span>
            </label>
            <select
              value={alertType}
              onChange={(e) => setAlertType(e.target.value as typeof alertType)}
              className={INPUT_CLS}
            >
              <option value="both">Both — threshold &amp; new lowest</option>
              <option value="below_threshold">Below threshold price</option>
              <option value="new_lowest">New lowest fare seen</option>
            </select>
          </div>
        </div>

        {needsThreshold && (
          <div className="mb-5">
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-premium-muted">
              Threshold Price (₹ INR) <span className="text-gold normal-case">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={thresholdPrice}
              onChange={(e) => setThresholdPrice(e.target.value)}
              placeholder="e.g. 15000"
              required={needsThreshold}
              className={`${INPUT_CLS} sm:max-w-xs`}
            />
          </div>
        )}

        {/* Notifications */}
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-premium-muted">Notifications</p>
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-premium-muted">
              Email <span className="text-gold normal-case">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className={INPUT_CLS}
            />
          </div>
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-premium-muted">
              WhatsApp <span className="text-premium-muted/40 normal-case">(Phase 2)</span>
            </label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+91 98765 43210"
              className={INPUT_CLS}
            />
          </div>
        </div>

        {/* Status messages */}
        {createError && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-danger/30 bg-danger/8 p-4 text-sm text-danger">
            <span className="mt-0.5">⚠</span>
            <p>{createError}</p>
          </div>
        )}
        {createSuccess && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-success/30 bg-success/8 p-4 text-sm text-success">
            <span className="mt-0.5">✓</span>
            <p>Watch created — initial fare check running in the background.</p>
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-premium-muted/50">
            Checked daily at your chosen time · Configure SMTP in .env for email
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2.5 rounded-xl bg-gold px-6 py-3 text-sm font-bold text-premium-bg transition-all duration-200 hover:bg-gold-hover hover:shadow-gold active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-premium-bg/30 border-t-premium-bg" />
                Creating…
              </>
            ) : (
              "+ Create Watch"
            )}
          </button>
        </div>
      </form>

      {/* ── Active watches dashboard ─────────────────────────────────────── */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-premium-muted">
              Active Watches
            </h3>
            {watches.length > 0 && (
              <span className="rounded-full border border-premium-border bg-premium-hover px-2.5 py-0.5 text-xs font-semibold text-white">
                {watches.length}
              </span>
            )}
          </div>
          <button
            onClick={loadWatches}
            className="rounded-lg border border-premium-border px-3 py-1.5 text-xs font-medium text-premium-muted transition-all hover:border-gold/30 hover:text-gold"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {loading && watches.length === 0 ? (
          <div className="rounded-2xl border border-premium-border bg-premium-card p-8 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-premium-muted">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-premium-border border-t-gold" />
              Loading watches…
            </div>
          </div>
        ) : watches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-premium-border bg-premium-card/50 p-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-premium-border bg-premium-hover">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 text-premium-muted">
                <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm font-medium text-premium-muted">No watches yet</p>
            <p className="mt-1 text-xs text-premium-muted/50">
              Create a watch above to start monitoring a route
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {watches.map((w) => (
              <WatchCard
                key={w.id}
                watch={w}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onCheckNow={handleCheckNow}
              />
            ))}
          </div>
        )}
      </div>

      <p className="text-center text-xs text-premium-muted/30">
        Scheduler checks active watches every minute at their configured time
      </p>
    </div>
  );
}
