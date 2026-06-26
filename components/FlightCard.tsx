export type Trend = "up" | "down" | "same";

export interface FlightCardData {
  origin: string;
  destination: string;
  lowestPrice: number;
  averagePrice: number;
  currency: string;
  airline: string;
  lastUpdated: string;
  trend: Trend;
}

function TrendBadge({ trend }: { trend: Trend }) {
  const config = {
    up: { icon: "↑", label: "Rising", className: "bg-red-900/40 text-red-400 border border-red-800" },
    down: { icon: "↓", label: "Falling", className: "bg-green-900/40 text-green-400 border border-green-800" },
    same: { icon: "→", label: "Stable", className: "bg-gray-700/60 text-gray-400 border border-gray-600" },
  }[trend];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
      {config.icon} {config.label}
    </span>
  );
}

function formatPrice(amount: number, currency: string): string {
  if (currency === "INR") {
    return `₹${Math.round(amount).toLocaleString("en-IN")}`;
  }
  return `${currency} ${amount.toLocaleString()}`;
}

export default function FlightCard({ data }: { data: FlightCardData }) {
  const { origin, destination, lowestPrice, averagePrice, currency, airline, lastUpdated, trend } = data;

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800 p-5 shadow-lg transition-all duration-200 hover:border-blue-600 hover:shadow-blue-900/20">
      {/* Route header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-gray-500">Route</p>
          <h2 className="mt-1 text-lg font-semibold text-white">
            {origin} <span className="text-blue-400">→</span> {destination}
          </h2>
        </div>
        <TrendBadge trend={trend} />
      </div>

      {/* Price grid */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-gray-900/60 p-3">
          <p className="text-xs text-gray-500">Lowest Price</p>
          <p className="mt-1 text-xl font-bold text-green-400">
            {formatPrice(lowestPrice, currency)}
          </p>
        </div>
        <div className="rounded-lg bg-gray-900/60 p-3">
          <p className="text-xs text-gray-500">Average Price</p>
          <p className="mt-1 text-xl font-bold text-white">
            {formatPrice(averagePrice, currency)}
          </p>
        </div>
      </div>

      {/* Meta info */}
      <div className="flex items-center justify-between border-t border-gray-700 pt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span>🛫</span> {airline}
        </span>
        <span>Updated {lastUpdated}</span>
      </div>
    </div>
  );
}
