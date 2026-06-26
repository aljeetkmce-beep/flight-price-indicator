import Header from "@/components/Header";
import SearchForm from "@/components/SearchForm";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-premium-bg">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <SearchForm />
      </main>
      <footer className="border-t border-premium-border py-4 text-center text-xs text-premium-muted/40">
        Flight Price Indicator · Fares in INR · Data via Skyscanner
      </footer>
    </div>
  );
}
