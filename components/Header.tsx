interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-premium-border bg-premium-bg/90 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5 text-gold"
              >
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white sm:text-base">
                {title ?? "Flight Price Indicator"}
              </h1>
              <p className="hidden text-xs text-premium-muted sm:block">
                {subtitle ?? "Travel Planning Assistant · Powered by Skyscanner"}
              </p>
            </div>
          </div>

          {/* Right side badge */}
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-gold/20 bg-gold/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-gold sm:inline-block">
              Premium
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-premium-border bg-premium-card text-premium-muted transition-colors hover:border-gold/30 hover:text-gold">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.205 1.251l-1.18 2.044a1 1 0 01-1.186.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.992 6.992 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
