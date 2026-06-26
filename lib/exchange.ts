const FALLBACK_RATE = 84; // conservative fallback if API is unreachable

interface FrankfurterResponse {
  rates: { INR: number };
}

export async function getUsdToInr(): Promise<number> {
  try {
    const res = await fetch("https://api.frankfurter.app/latest?from=USD&to=INR", {
      next: { revalidate: 3600 }, // cache on server for 1 hour
    });

    if (!res.ok) return FALLBACK_RATE;

    const data: FrankfurterResponse = await res.json();
    return data.rates?.INR ?? FALLBACK_RATE;
  } catch {
    return FALLBACK_RATE;
  }
}
