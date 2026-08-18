const CAPABILITIES = [
  "Java & Spring Boot",
  "Microservices",
  "REST API engineering",
  "React & Next.js",
  "Azure DevOps CI/CD",
  "Rapid MVP delivery",
  "AI-assisted development",
] as const;

export function CapabilityTicker() {
  const repeated = [...CAPABILITIES, ...CAPABILITIES];

  return (
    <div
      aria-label={`Capabilities: ${CAPABILITIES.join(", ")}`}
      className="overflow-hidden border-y border-hairline bg-white/[0.015] py-space-2"
    >
      <div aria-hidden="true" className="ticker-track flex w-max items-center">
        {repeated.map((capability, index) => (
          <div
            key={`${capability}-${index}`}
            className="flex shrink-0 items-center gap-space-4 px-space-4 font-mono text-caption uppercase tracking-[0.16em] text-muted"
          >
            <span>{capability}</span>
            <span className="text-accent">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
