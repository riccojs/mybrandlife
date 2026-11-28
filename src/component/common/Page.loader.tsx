import { Loader2 } from "lucide-react";

/** Full-section spinner shown while the session is being checked. */
function PageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div role="status" className="flex min-h-[50vh] flex-col items-center justify-center gap-3 py-16">
      <Loader2 className="size-7 animate-spin text-[#2A65E9]" />
      <p className="text-sm text-[#161B2B]/60">{label}</p>
    </div>
  );
}

export default PageLoader;
