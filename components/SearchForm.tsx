"use client";

import { useState, useEffect } from "react";
import { AirportInput } from "@/components/AirportInput";
import { PriceWatchPanel } from "@/components/PriceWatchPanel";

// ── Types ──────────────────────────────────────────────────────────────────
interface FlightRow {
  origin: string;
  destination: string;
  originCity: string;
  destCity: string;
  date: string;
  airline: string;
  flightNumbers: string;
  priceINR: number;
  stops: number;
  duration: string;
  durationMins: number;
  departureTime: string;
  arrivalTime: string;
  layoverMins: number;
}

interface FinalOption extends FlightRow {
  candidateDate: string;
  rank: number;
}

interface RecommendationData {
  row: FlightRow;
  avgPriceINR: number;
  highestPriceINR: number;
  savingsINR: number;
  decision: "BOOK NOW" | "WAIT";
}

interface SummaryData {
  totalOptions: number;
  lowestINR: number;
  averageINR: number;
  highestINR: number;
  bestOrigin: string;
  bestDate: string;
  bestAirline: string;
}

interface PlanResult {
  success: true;
  rows: FlightRow[];
  recommendation: RecommendationData;
  summary: SummaryData;
  exchangeRate: number;
  searchedAt: string;
}

interface CandidateGroup {
  candidateDate: string;
  best: FlightRow;
  secondBest: FlightRow | null;
}

interface FlexRec {
  row: FlightRow;
  avgPriceINR: number;
  savingsINR: number;
  decision: "BOOK NOW" | "WAIT";
}

interface FlexibleResult {
  success: true;
  groups: CandidateGroup[];
  finalOptions: FinalOption[];
  recommendation: FlexRec;
  exchangeRate: number;
  searchedAt: string;
}

type SortKey =
  | "origin"
  | "destination"
  | "date"
  | "airline"
  | "flightNumbers"
  | "departureTime"
  | "arrivalTime"
  | "durationMins"
  | "stops"
  | "layoverMins"
  | "priceINR";

type SortDir = "asc" | "desc";

// ── Helpers ────────────────────────────────────────────────────────────────
function rupees(n: number): string {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function minsToHuman(mins: number): string {
  if (mins === 0) return "Direct";
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function fmtDate(d: string): string {
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    weekday: "short",
  });
}

function cityCode(city: string, code: string): string {
  return `${city} (${code})`;
}

const NUMERIC_KEYS: SortKey[] = ["priceINR", "stops", "durationMins", "layoverMins"];

function sortRows(rows: FlightRow[], key: SortKey, dir: SortDir): FlightRow[] {
  return [...rows].sort((a, b) => {
    let cmp = 0;
    if (NUMERIC_KEYS.includes(key)) {
      cmp = (a[key] as number) - (b[key] as number);
    } else {
      cmp = String(a[key]).localeCompare(String(b[key]));
    }
    return dir === "asc" ? cmp : -cmp;
  });
}

function isRecommended(row: FlightRow, rec: FlightRow): boolean {
  return (
    row.origin === rec.origin &&
    row.date === rec.date &&
    row.airline === rec.airline &&
    row.priceINR === rec.priceINR &&
    row.departureTime === rec.departureTime
  );
}

// ── Premium theme colors ───────────────────────────────────────────────────
const GROUP_COLORS: [string, string][] = [
  ["#D4AF37", "#F4C542"],
  ["#6366F1", "#818CF8"],
  ["#10B981", "#34D399"],
];

const INPUT_CLS =
  "w-full rounded-xl border border-premium-border bg-black/40 px-4 py-3.5 text-sm text-white placeholder-premium-muted/40 transition-all duration-200 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/10";

// ── Airline badge ──────────────────────────────────────────────────────────
function airlineColor(name: string): string {
  const palette = ["#D4AF37", "#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#3B82F6", "#F59E0B"];
  let h = 5381;
  for (let i = 0; i < name.length; i++) h = ((h << 5) + h) ^ name.charCodeAt(i);
  return palette[Math.abs(h) % palette.length];
}

function AirlineBadge({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const color = airlineColor(name);
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
  const cls =
    size === "sm"
      ? "h-7 w-7 rounded-lg text-[10px]"
      : size === "lg"
      ? "h-11 w-11 rounded-xl text-sm"
      : "h-9 w-9 rounded-xl text-xs";
  return (
    <div
      className={`${cls} shrink-0 flex items-center justify-center font-bold`}
      style={{ backgroundColor: color + "28", color, border: `1px solid ${color}45` }}
    >
      {initials}
    </div>
  );
}

// ── Sort bar ───────────────────────────────────────────────────────────────
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "priceINR", label: "Price" },
  { key: "durationMins", label: "Duration" },
  { key: "departureTime", label: "Departure" },
  { key: "stops", label: "Stops" },
  { key: "layoverMins", label: "Layover" },
];

function SortBar({
  sortKey,
  sortDir,
  onSort,
}: {
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (k: SortKey) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-premium-muted">Sort</span>
      {SORT_OPTIONS.map(({ key, label }) => {
        const active = sortKey === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSort(key)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 ${
              active
                ? "border border-gold/40 bg-gold/12 text-gold"
                : "border border-premium-border bg-transparent text-premium-muted hover:border-gold/25 hover:text-white"
            }`}
          >
            {label}
            {active && <span className="ml-1 opacity-80">{sortDir === "asc" ? "↑" : "↓"}</span>}
          </button>
        );
      })}
    </div>
  );
}

// ── Flight card ────────────────────────────────────────────────────────────
function FlightCard({
  row,
  isRec,
  index,
  groupLabel,
  groupColor,
}: {
  row: FlightRow & { candidateDate?: string; rank?: number };
  isRec: boolean;
  index: number;
  groupLabel?: string;
  groupColor?: string;
}) {
  const longLayover = row.layoverMins > 600;
  const longDuration = row.durationMins > 900;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-px hover:shadow-card-gold animate-fadeInUp ${
        isRec
          ? "border-gold/45 bg-[#1A190E]"
          : "border-premium-border bg-premium-card hover:border-gold/20 hover:bg-premium-hover"
      }`}
      style={{ animationDelay: `${Math.min(index * 55, 500)}ms` }}
    >
      {/* Gold top accent for recommended */}
      {isRec && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      )}

      {/* Header row */}
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <AirlineBadge name={row.airline} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{row.airline}</p>
            <p className="truncate font-mono text-xs text-premium-muted">{row.flightNumbers}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
          {isRec && (
            <span className="rounded-full border border-gold/35 bg-gold/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold">
              ★ Best Pick
            </span>
          )}
          {groupLabel && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{ background: (groupColor ?? "#D4AF37") + "22", color: groupColor ?? "#D4AF37", border: `1px solid ${groupColor ?? "#D4AF37"}40` }}
            >
              {groupLabel}
            </span>
          )}
          {longDuration && (
            <span className="rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[10px] font-bold text-warning">
              ⚠ Long
            </span>
          )}
          {longLayover && !longDuration && (
            <span className="rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[10px] font-bold text-warning">
              ⚠ Layover
            </span>
          )}
        </div>
      </div>

      {/* Route row */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Departure */}
        <div className="text-left">
          <p className="text-2xl font-bold leading-none text-white sm:text-3xl">{row.departureTime}</p>
          <p className="mt-1.5 text-sm font-bold text-gold">{row.origin}</p>
          <p className="text-xs text-premium-muted">{row.originCity}</p>
        </div>

        {/* Center */}
        <div className="min-w-0 flex-1 px-2 text-center">
          <p className="mb-1.5 text-xs text-premium-muted">{row.duration}</p>
          <div className="flex items-center gap-1">
            <div className="h-px flex-1 bg-premium-border" />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-gold">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
            <div className="h-px flex-1 bg-premium-border" />
          </div>
          <p className={`mt-1.5 text-xs ${longLayover ? "font-medium text-warning" : "text-premium-muted"}`}>
            {row.stops === 0
              ? "Direct"
              : `${row.stops} Stop${row.stops > 1 ? "s" : ""} · ${minsToHuman(row.layoverMins)}`}
          </p>
        </div>

        {/* Arrival */}
        <div className="text-right">
          <p className="text-2xl font-bold leading-none text-white sm:text-3xl">{row.arrivalTime}</p>
          <p className="mt-1.5 text-sm font-bold text-gold">{row.destination}</p>
          <p className="text-xs text-premium-muted">{row.destCity}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-premium-border/60 pt-3.5">
        <p className="text-xs text-premium-muted">{fmtDate(row.date)}</p>
        <p className={`text-xl font-bold sm:text-2xl ${isRec ? "text-gold" : "text-success"}`}>
          {rupees(row.priceINR)}
        </p>
      </div>
    </div>
  );
}

// ── Flight card skeleton ───────────────────────────────────────────────────
function FlightCardSkeleton() {
  return (
    <div className="rounded-2xl border border-premium-border bg-premium-card p-5">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl shimmer-bg" />
          <div className="space-y-2">
            <div className="h-3.5 w-28 rounded shimmer-bg" />
            <div className="h-2.5 w-16 rounded shimmer-bg" />
          </div>
        </div>
        <div className="h-5 w-20 rounded-full shimmer-bg" />
      </div>
      <div className="flex items-center gap-4">
        <div className="space-y-2">
          <div className="h-8 w-16 rounded shimmer-bg" />
          <div className="h-3 w-8 rounded shimmer-bg" />
          <div className="h-2.5 w-20 rounded shimmer-bg" />
        </div>
        <div className="flex-1 space-y-2 px-2">
          <div className="mx-auto h-2.5 w-14 rounded shimmer-bg" />
          <div className="h-px shimmer-bg" />
          <div className="mx-auto h-2.5 w-20 rounded shimmer-bg" />
        </div>
        <div className="space-y-2 text-right">
          <div className="ml-auto h-8 w-16 rounded shimmer-bg" />
          <div className="ml-auto h-3 w-8 rounded shimmer-bg" />
          <div className="ml-auto h-2.5 w-20 rounded shimmer-bg" />
        </div>
      </div>
      <div className="mt-4 flex justify-between border-t border-premium-border pt-3.5">
        <div className="h-3.5 w-24 rounded shimmer-bg" />
        <div className="h-6 w-24 rounded shimmer-bg" />
      </div>
    </div>
  );
}

// ── Loading state ──────────────────────────────────────────────────────────
function LoadingState({ origins, isFlexible }: { origins: string[]; isFlexible?: boolean }) {
  const validOrigins = origins.filter((o) => /^[A-Z]{3}$/.test(o));
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-gold/25 bg-premium-card p-8 text-center">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-7 w-7 animate-bounce text-gold">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-white">
          {isFlexible ? "Planning Flexible Dates" : "Searching Routes"}
        </h3>
        <p className="mt-1.5 text-sm text-premium-muted">
          {validOrigins.length > 0
            ? `Querying Skyscanner for ${validOrigins.join(", ")} — comparing all fares`
            : "Connecting to Skyscanner · Comparing fares"}
        </p>
        <div className="mt-5 flex items-center justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-gold"
              style={{ animation: "bounceDot 1.2s infinite ease-in-out", animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
      {[0, 1, 2].map((i) => (
        <FlightCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ── Origin comparison cards ────────────────────────────────────────────────
function OriginComparisonCards({ rows }: { rows: FlightRow[] }) {
  const originMap = new Map<string, { city: string; minPrice: number }>();
  for (const r of rows) {
    const ex = originMap.get(r.origin);
    if (!ex || r.priceINR < ex.minPrice) {
      originMap.set(r.origin, { city: r.originCity, minPrice: r.priceINR });
    }
  }
  const sorted = Array.from(originMap.entries()).sort((a, b) => a[1].minPrice - b[1].minPrice);
  if (sorted.length < 2) return null;

  return (
    <div>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-premium-muted">
        Best Fare by Origin
      </p>
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${sorted.length}, 1fr)` }}
      >
        {sorted.map(([code, data], i) => (
          <div
            key={code}
            className={`relative overflow-hidden rounded-2xl border p-4 text-center transition-all ${
              i === 0
                ? "border-gold/45 bg-gradient-to-b from-[#1C1A0E] to-premium-card"
                : "border-premium-border bg-premium-card"
            }`}
          >
            {i === 0 && (
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
            )}
            <p className="text-xs text-premium-muted">{data.city}</p>
            <p className={`mt-0.5 text-base font-bold ${i === 0 ? "text-gold" : "text-white"}`}>{code}</p>
            <p className={`mt-2 text-xl font-bold ${i === 0 ? "text-gold" : "text-white"}`}>
              {rupees(data.minPrice)}
            </p>
            {i === 0 && (
              <span className="mt-2.5 inline-block rounded-full border border-gold/30 bg-gold/12 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold">
                Cheapest
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Date timeline cards (flexible mode) ───────────────────────────────────
function DateTimelineCards({
  groups,
  recommendedCandidateDate,
}: {
  groups: CandidateGroup[];
  recommendedCandidateDate: string;
}) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-premium-muted">
        Candidate Dates
      </p>
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${groups.length}, 1fr)` }}
      >
        {groups.map((g, i) => {
          const isBest = g.candidateDate === recommendedCandidateDate;
          const color = GROUP_COLORS[i % GROUP_COLORS.length][0];
          const bestFare = g.best?.priceINR;
          const dateLabel = new Date(g.candidateDate + "T00:00:00").toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          });

          return (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl border p-5 text-center transition-all ${
                isBest
                  ? "border-gold/45 bg-gradient-to-b from-[#1C1A0E] to-premium-card"
                  : "border-premium-border bg-premium-card"
              }`}
            >
              {isBest && (
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
              )}
              <p className="text-[11px] font-medium uppercase tracking-widest text-premium-muted">
                Date {i + 1}
              </p>
              <p
                className="mt-1 text-lg font-bold"
                style={{ color: isBest ? "#D4AF37" : color }}
              >
                {dateLabel}
              </p>
              {bestFare !== undefined && (
                <p className={`mt-2 text-xl font-bold ${isBest ? "text-gold" : "text-white"}`}>
                  {rupees(bestFare)}
                </p>
              )}
              {isBest ? (
                <span className="mt-3 inline-block rounded-full border border-gold/30 bg-gold/12 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold">
                  ★ Best Date
                </span>
              ) : (
                g.best && (
                  <p className="mt-2 text-xs text-premium-muted">{g.best.airline}</p>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Premium recommendation card ────────────────────────────────────────────
function PremiumRecommendationCard({
  rec,
  decision,
  savingsINR,
  avgPriceINR,
}: {
  rec: FlightRow;
  decision: "BOOK NOW" | "WAIT";
  savingsINR?: number;
  avgPriceINR?: number;
}) {
  const isBook = decision === "BOOK NOW";
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-6 ${
        isBook
          ? "border-gold/45 bg-gradient-to-br from-[#1C1A0E] via-[#181810] to-premium-card"
          : "border-warning/35 bg-gradient-to-br from-[#1A1308] via-[#181510] to-premium-card"
      }`}
    >
      {/* Top accent */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: isBook
            ? "linear-gradient(to right, transparent, #D4AF37, transparent)"
            : "linear-gradient(to right, transparent, #FF9800, transparent)",
        }}
      />

      {/* Header */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-widest ${
              isBook
                ? "border-gold/35 bg-gold/12 text-gold"
                : "border-warning/35 bg-warning/12 text-warning"
            }`}
          >
            {isBook ? "★ Book Now" : "⏳ Wait"}
          </span>
          <h3 className="mt-3 text-[11px] font-semibold uppercase tracking-widest text-premium-muted">
            Recommended Flight
          </h3>
        </div>
        <div className="text-right">
          <p className={`text-3xl font-bold ${isBook ? "text-gold" : "text-warning"}`}>
            {rupees(rec.priceINR)}
          </p>
          {savingsINR !== undefined && savingsINR > 0 && avgPriceINR && (
            <p className="mt-0.5 text-xs text-success">
              Save {rupees(savingsINR)} vs avg {rupees(avgPriceINR)}
            </p>
          )}
        </div>
      </div>

      {/* Airline */}
      <div className="mb-5 flex items-center gap-3">
        <AirlineBadge name={rec.airline} size="lg" />
        <div>
          <p className="text-lg font-bold text-white">{rec.airline}</p>
          <p className="font-mono text-sm text-premium-muted">{rec.flightNumbers}</p>
        </div>
      </div>

      {/* Route */}
      <div className="mb-5 flex items-center gap-4 rounded-xl border border-premium-border/50 bg-black/20 p-5">
        <div>
          <p className="text-3xl font-bold text-white">{rec.departureTime}</p>
          <p className="mt-1.5 text-base font-bold text-gold">{rec.origin}</p>
          <p className="text-xs text-premium-muted">{rec.originCity}</p>
        </div>
        <div className="flex-1 px-2 text-center">
          <p className="mb-1.5 text-xs text-premium-muted">{rec.duration}</p>
          <div className="flex items-center gap-1">
            <div className="h-px flex-1 bg-premium-border" />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gold">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
            <div className="h-px flex-1 bg-premium-border" />
          </div>
          <p className="mt-1.5 text-xs text-premium-muted">
            {rec.stops === 0
              ? "Direct"
              : `${rec.stops} Stop${rec.stops > 1 ? "s" : ""} · ${minsToHuman(rec.layoverMins)}`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-white">{rec.arrivalTime}</p>
          <p className="mt-1.5 text-base font-bold text-gold">{rec.destination}</p>
          <p className="text-xs text-premium-muted">{rec.destCity}</p>
        </div>
      </div>

      {/* Meta footer */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-premium-muted">
        <span>{fmtDate(rec.date)}</span>
        <span className="text-premium-border">·</span>
        <span>{rec.stops === 0 ? "Direct" : `${rec.stops} stop${rec.stops > 1 ? "s" : ""}`}</span>
        <span className="text-premium-border">·</span>
        <span>Layover: {minsToHuman(rec.layoverMins)}</span>
        <span className="ml-auto text-[10px] uppercase tracking-wide opacity-50">
          Scored on price, duration, stops & layover
        </span>
      </div>
    </div>
  );
}

// ── Summary stats ──────────────────────────────────────────────────────────
function SummaryStats({
  summary,
  exchangeRate,
  searchedAt,
}: {
  summary: SummaryData;
  exchangeRate: number;
  searchedAt: string;
}) {
  const stats = [
    { label: "Total Options", value: String(summary.totalOptions), color: "text-white" },
    { label: "Lowest Fare", value: rupees(summary.lowestINR), color: "text-success" },
    { label: "Average Fare", value: rupees(summary.averageINR), color: "text-white" },
    { label: "Highest Fare", value: rupees(summary.highestINR), color: "text-danger" },
    { label: "Best Origin", value: summary.bestOrigin, color: "text-gold" },
    { label: "Best Airline", value: summary.bestAirline, color: "text-white" },
  ];

  return (
    <div className="rounded-2xl border border-premium-border bg-premium-card p-5">
      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-premium-muted">
        Route Summary
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-premium-border/50 bg-black/20 p-3">
            <p className="mb-1 text-[10px] text-premium-muted">{label}</p>
            <p className={`text-sm font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-premium-muted/40">
        Best date: {fmtDate(summary.bestDate)} · Rate: ₹{exchangeRate.toFixed(2)}/USD · Updated{" "}
        {new Date(searchedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
      </p>
    </div>
  );
}

// ── Error alert ────────────────────────────────────────────────────────────
function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-danger/30 bg-danger/8 p-4">
      <span className="mt-0.5 text-danger">⚠</span>
      <p className="text-sm text-danger/90">{message}</p>
    </div>
  );
}

// ── Section header ─────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-semibold uppercase tracking-widest text-premium-muted">
      {children}
    </h3>
  );
}

// ── Submit button ──────────────────────────────────────────────────────────
function SubmitButton({ loading, label, loadingLabel }: { loading: boolean; label: string; loadingLabel: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex items-center gap-2.5 rounded-xl bg-gold px-6 py-3 text-sm font-bold text-premium-bg transition-all duration-200 hover:bg-gold-hover hover:shadow-gold active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-premium-bg/30 border-t-premium-bg" />
          {loadingLabel}
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function SearchForm() {
  // Shared
  const [mode, setMode] = useState<"fixed" | "flexible" | "pricewatch">("fixed");
  const [minDate, setMinDate] = useState("");

  // Fixed Date Search state
  const [origins, setOrigins] = useState(["", "", ""]);
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [maxLayoverHours, setMaxLayoverHours] = useState("20");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("priceINR");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // Flexible Date Planning state
  const [fOrigins, setFOrigins] = useState(["", "", ""]);
  const [fDest, setFDest] = useState("");
  const [fDates, setFDates] = useState(["", "", ""]);
  const [fMaxLayover, setFMaxLayover] = useState("20");
  const [fLoading, setFLoading] = useState(false);
  const [fResult, setFResult] = useState<FlexibleResult | null>(null);
  const [fError, setFError] = useState<string | null>(null);
  const [fSortKey, setFSortKey] = useState<SortKey>("priceINR");
  const [fSortDir, setFSortDir] = useState<SortDir>("asc");

  useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    setMinDate(todayStr);

    const depart = new Date();
    depart.setDate(depart.getDate() + 30);
    const departStr = depart.toISOString().split("T")[0];
    setDate(departStr);

    // Flexible defaults: +30, +37, +44 days
    const d2 = new Date();
    d2.setDate(d2.getDate() + 37);
    const d3 = new Date();
    d3.setDate(d3.getDate() + 44);
    setFDates([departStr, d2.toISOString().split("T")[0], d3.toISOString().split("T")[0]]);
  }, []);

  // ── Fixed mode handlers ──────────────────────────────────────────────────
  function updateOrigin(index: number, value: string) {
    setOrigins((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const validOrigins = origins.filter((o) => /^[A-Z]{3}$/.test(o));
    if (!validOrigins.length) { setError("Enter at least one 3-letter IATA origin code."); return; }
    if (!/^[A-Z]{3}$/.test(destination)) { setError("Destination must be a 3-letter IATA code."); return; }
    if (!date) { setError("Please select a travel date."); return; }
    if (validOrigins.includes(destination)) { setError("Origin and destination must be different."); return; }

    setLoading(true); setError(null); setResult(null);
    try {
      const qs = new URLSearchParams({ origins: validOrigins.join(","), destination, date, maxLayoverHours });
      const res = await fetch(`/api/plan?${qs}`);
      const data = await res.json();
      if (!data.success) { setError(data.error ?? "Search failed."); }
      else { setResult(data as PlanResult); setSortKey("priceINR"); setSortDir("asc"); }
    } catch { setError("Network error. Please check your connection."); }
    finally { setLoading(false); }
  }

  // ── Flexible mode handlers ───────────────────────────────────────────────
  function updateFOrigin(index: number, value: string) {
    setFOrigins((prev) => { const next = [...prev]; next[index] = value; return next; });
  }

  function updateFDate(index: number, value: string) {
    setFDates((prev) => { const next = [...prev]; next[index] = value; return next; });
  }

  function handleFSort(key: SortKey) {
    if (fSortKey === key) setFSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setFSortKey(key); setFSortDir("asc"); }
  }

  async function handleFlexSearch(e: React.FormEvent) {
    e.preventDefault();
    const validOrigins = fOrigins.filter((o) => /^[A-Z]{3}$/.test(o));
    const validDates = fDates.filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));
    if (!validOrigins.length) { setFError("Enter at least one 3-letter IATA origin code."); return; }
    if (!/^[A-Z]{3}$/.test(fDest)) { setFError("Destination must be a 3-letter IATA code."); return; }
    if (!validDates.length) { setFError("Enter at least one candidate date."); return; }
    if (validOrigins.includes(fDest)) { setFError("Origin and destination must be different."); return; }

    setFLoading(true); setFError(null); setFResult(null);
    try {
      const qs = new URLSearchParams({
        origins: validOrigins.join(","),
        destination: fDest,
        dates: validDates.join(","),
        maxLayoverHours: fMaxLayover,
      });
      const res = await fetch(`/api/flexible?${qs}`);
      const data = await res.json();
      if (!data.success) { setFError(data.error ?? "Search failed."); }
      else { setFResult(data as FlexibleResult); setFSortKey("priceINR"); setFSortDir("asc"); }
    } catch { setFError("Network error. Please check your connection."); }
    finally { setFLoading(false); }
  }

  // ── Derived data ─────────────────────────────────────────────────────────
  const sortedFixedRows = result ? sortRows(result.rows, sortKey, sortDir) : [];
  const sortedFinalOptions = fResult
    ? (sortRows(fResult.finalOptions, fSortKey, fSortDir) as FinalOption[])
    : [];

  const fGroupColorMap: Record<string, string> = {};
  if (fResult) {
    fResult.groups.forEach((g, i) => {
      fGroupColorMap[g.candidateDate] = GROUP_COLORS[i % GROUP_COLORS.length][0];
    });
  }

  const rec = result?.recommendation;
  const summary = result?.summary;
  const fRec = fResult?.recommendation;

  // Find which candidate date the flexible recommendation belongs to
  const fRecCandidateDate =
    fResult && fRec
      ? (fResult.finalOptions.find(
          (opt) =>
            opt.origin === fRec.row.origin &&
            opt.date === fRec.row.date &&
            opt.airline === fRec.row.airline &&
            opt.priceINR === fRec.row.priceINR
        )?.candidateDate ?? "")
      : "";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── Mode Toggle ──────────────────────────────────────────────────── */}
      <div className="flex gap-1 rounded-2xl border border-premium-border bg-premium-card p-1">
        {(
          [
            { key: "fixed", label: "Fixed Date" },
            { key: "flexible", label: "Flexible Dates" },
            { key: "pricewatch", label: "Price Watch" },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-all duration-200 ${
              mode === key
                ? "bg-gold text-premium-bg shadow-gold"
                : "text-premium-muted hover:bg-premium-hover hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          FIXED DATE SEARCH
          ════════════════════════════════════════════════════════════════════ */}
      {mode === "fixed" && (
        <>
          <form onSubmit={handleSearch} className="rounded-2xl border border-premium-border bg-premium-card p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Find Best Flights</h2>
              <p className="mt-1 text-sm text-premium-muted">
                Compare fares from multiple origins on a single date
              </p>
            </div>

            {/* Destination + Date + Max Layover */}
            <div className="mb-5 grid gap-4 sm:grid-cols-3">
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
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-premium-muted">
                  Max Layover Hours
                </label>
                <input
                  type="number"
                  min="0"
                  max="48"
                  step="1"
                  value={maxLayoverHours}
                  onChange={(e) => setMaxLayoverHours(e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
            </div>

            {/* Origins */}
            <div className="mb-6">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-premium-muted">
                Origin Airports — Compare Up to 3
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {origins.map((o, i) => (
                  <AirportInput
                    key={i}
                    value={o}
                    onChange={(v) => updateOrigin(i, v)}
                    label={
                      <>
                        Origin {i + 1}{" "}
                        {i === 0 ? (
                          <span className="text-gold normal-case">*</span>
                        ) : (
                          <span className="text-premium-muted/40 normal-case">(optional)</span>
                        )}
                      </>
                    }
                    placeholder={i === 0 ? "e.g. TRV or Trivandrum" : "e.g. COK or Kochi"}
                    required={i === 0}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-premium-muted/50">Searches ±1 day · All prices in ₹ INR</p>
              <SubmitButton loading={loading} label="Search Flights" loadingLabel="Searching…" />
            </div>
          </form>

          {error && <ErrorAlert message={error} />}

          {loading && <LoadingState origins={origins} />}

          {!loading && result && rec && summary && (
            <div className="space-y-5 animate-fadeIn">
              <OriginComparisonCards rows={result.rows} />
              <PremiumRecommendationCard
                rec={rec.row}
                decision={rec.decision}
                savingsINR={rec.savingsINR}
                avgPriceINR={rec.avgPriceINR}
              />

              {/* Flight list */}
              <div className="rounded-2xl border border-premium-border bg-premium-card p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <SectionLabel>All Options</SectionLabel>
                    <span className="rounded-full border border-premium-border bg-premium-hover px-2.5 py-0.5 text-xs font-semibold text-white">
                      {result.rows.length}
                    </span>
                  </div>
                  <SortBar sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                </div>
                <div className="space-y-3">
                  {sortedFixedRows.map((row, i) => (
                    <FlightCard
                      key={i}
                      row={row}
                      isRec={isRecommended(row, rec.row)}
                      index={i}
                    />
                  ))}
                </div>
              </div>

              <SummaryStats summary={summary} exchangeRate={result.exchangeRate} searchedAt={result.searchedAt} />
            </div>
          )}
        </>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          FLEXIBLE DATE PLANNING
          ════════════════════════════════════════════════════════════════════ */}
      {mode === "flexible" && (
        <>
          <form onSubmit={handleFlexSearch} className="rounded-2xl border border-premium-border bg-premium-card p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Flexible Date Planning</h2>
              <p className="mt-1 text-sm text-premium-muted">
                Compare multiple dates and find the cheapest window to fly
              </p>
            </div>

            {/* Destination + Max Layover */}
            <div className="mb-5 grid gap-4 sm:grid-cols-2">
              <AirportInput
                value={fDest}
                onChange={setFDest}
                label={<>Destination <span className="text-gold normal-case">*</span></>}
                placeholder="e.g. BKK or Bangkok"
                required
              />
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-premium-muted">
                  Max Layover Hours
                </label>
                <input
                  type="number"
                  min="0"
                  max="48"
                  step="1"
                  value={fMaxLayover}
                  onChange={(e) => setFMaxLayover(e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
            </div>

            {/* Origins */}
            <div className="mb-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-premium-muted">
                Origin Airports
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {fOrigins.map((o, i) => (
                  <AirportInput
                    key={i}
                    value={o}
                    onChange={(v) => updateFOrigin(i, v)}
                    label={
                      <>
                        Origin {i + 1}{" "}
                        {i === 0 ? (
                          <span className="text-gold normal-case">*</span>
                        ) : (
                          <span className="text-premium-muted/40 normal-case">(optional)</span>
                        )}
                      </>
                    }
                    placeholder={i === 0 ? "e.g. TRV or Trivandrum" : "e.g. COK or Kochi"}
                    required={i === 0}
                  />
                ))}
              </div>
            </div>

            {/* Candidate Dates */}
            <div className="mb-6">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-premium-muted">
                Candidate Dates — Compare Up to 3
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <div key={i}>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-premium-muted">
                      Date {i + 1}{" "}
                      {i === 0 ? (
                        <span className="text-gold normal-case">*</span>
                      ) : (
                        <span className="text-premium-muted/40 normal-case">(optional)</span>
                      )}
                    </label>
                    <input
                      type="date"
                      min={minDate}
                      value={fDates[i]}
                      onChange={(e) => updateFDate(i, e.target.value)}
                      required={i === 0}
                      className={INPUT_CLS}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-premium-muted/50">
                Each date searched ±1 day · Best + 2nd best per group
              </p>
              <SubmitButton loading={fLoading} label="Compare Dates" loadingLabel="Planning…" />
            </div>
          </form>

          {fError && <ErrorAlert message={fError} />}

          {fLoading && <LoadingState origins={fOrigins} isFlexible />}

          {!fLoading && fResult && fRec && (
            <div className="space-y-5 animate-fadeIn">
              <DateTimelineCards groups={fResult.groups} recommendedCandidateDate={fRecCandidateDate} />
              <PremiumRecommendationCard
                rec={fRec.row}
                decision={fRec.decision}
                savingsINR={fRec.savingsINR}
                avgPriceINR={fRec.avgPriceINR}
              />

              {/* Final options */}
              <div className="rounded-2xl border border-premium-border bg-premium-card p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <SectionLabel>Final Options</SectionLabel>
                    <span className="rounded-full border border-premium-border bg-premium-hover px-2.5 py-0.5 text-xs font-semibold text-white">
                      {fResult.finalOptions.length}
                    </span>
                  </div>
                  <SortBar sortKey={fSortKey} sortDir={fSortDir} onSort={handleFSort} />
                </div>

                {/* Group color legend */}
                <div className="mb-4 flex flex-wrap gap-3">
                  {fResult.groups.map((g, i) => {
                    const color = GROUP_COLORS[i % GROUP_COLORS.length][0];
                    return (
                      <span
                        key={i}
                        className="flex items-center gap-1.5 text-xs text-premium-muted"
                      >
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-sm"
                          style={{ background: color }}
                        />
                        Date {i + 1}: {g.candidateDate.slice(5)}
                      </span>
                    );
                  })}
                </div>

                <div className="space-y-3">
                  {sortedFinalOptions.map((row, i) => {
                    const groupColor = fGroupColorMap[row.candidateDate];
                    const groupIdx = fResult.groups.findIndex((g) => g.candidateDate === row.candidateDate);
                    const groupLabel = groupIdx >= 0 ? `Date ${groupIdx + 1}` : undefined;
                    return (
                      <FlightCard
                        key={i}
                        row={row}
                        isRec={isRecommended(row, fRec.row)}
                        index={i}
                        groupLabel={groupLabel}
                        groupColor={groupColor}
                      />
                    );
                  })}
                </div>
              </div>

              <p className="text-right text-xs text-premium-muted/40">
                Rate: ₹{fResult.exchangeRate.toFixed(2)}/USD · Updated{" "}
                {new Date(fResult.searchedAt).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}
        </>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          PRICE WATCH & ALERTS
          ════════════════════════════════════════════════════════════════════ */}
      {mode === "pricewatch" && <PriceWatchPanel />}
    </div>
  );
}
