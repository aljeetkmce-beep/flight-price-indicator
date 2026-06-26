"use client";

import { useState, useEffect, useRef } from "react";
import { searchAirports, AIRPORTS_BY_CODE } from "@/lib/airports";
import type { Airport } from "@/lib/airports";

export function AirportInput({
  value,
  onChange,
  label,
  placeholder,
  required,
}: {
  value: string;
  onChange: (code: string) => void;
  label: React.ReactNode;
  placeholder?: string;
  required?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [hits, setHits] = useState<Airport[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = AIRPORTS_BY_CODE[value];
  const closedDisplay = selected ? `${selected.name} (${value})` : value;

  useEffect(() => {
    if (!open || query.length < 2) { setHits([]); return; }
    setHits(searchAirports(query, 8));
  }, [query, open]);

  function handleFocus() {
    setQuery(value);
    setOpen(true);
  }

  function handleBlur(e: React.FocusEvent) {
    if (containerRef.current?.contains(e.relatedTarget as Node)) return;
    const trimmed = query.trim().toUpperCase();
    if (/^[A-Z]{3}$/.test(trimmed)) onChange(trimmed);
    setOpen(false);
    setQuery("");
  }

  function handleSelect(airport: Airport) {
    onChange(airport.code);
    setOpen(false);
    setQuery("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") { setOpen(false); setQuery(""); }
  }

  return (
    <div ref={containerRef}>
      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-premium-muted">
        {label}
      </label>
      <div className="relative">
        {/* Plane icon */}
        <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
            className={`h-4 w-4 transition-colors ${open || value ? "text-gold" : "text-premium-border"}`}>
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </div>

        <input
          type="text"
          value={open ? query : closedDisplay}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? "Search airports…"}
          required={required}
          className="w-full rounded-xl border border-premium-border bg-black/40 py-3.5 pl-10 pr-4 text-sm text-white placeholder-premium-muted/40 transition-all duration-200 focus:border-gold/50 focus:bg-black/60 focus:outline-none focus:ring-2 focus:ring-gold/10"
        />

        {/* Selected badge */}
        {!open && value && (
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <span className="rounded-md border border-gold/30 bg-gold/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-gold">
              {value}
            </span>
          </div>
        )}

        {/* Dropdown */}
        {open && hits.length > 0 && (
          <ul className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-72 overflow-auto rounded-xl border border-premium-border bg-premium-card shadow-2xl">
            {hits.map((a) => (
              <li
                key={a.code}
                onMouseDown={(e) => { e.preventDefault(); handleSelect(a); }}
                className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-premium-hover"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gold/25 bg-gold/10 font-mono text-xs font-bold text-gold">
                  {a.code}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-white">{a.name}</span>
                  <span className="block truncate text-xs text-premium-muted">{a.city}, {a.country}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
