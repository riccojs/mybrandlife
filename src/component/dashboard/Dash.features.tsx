import { Check } from "lucide-react";
import { useAuth } from "../../hook/useAuth";
import domainFeatures from "../../utils/domain.features";

interface AuthType {
  user: ItemType | null;
}

interface ItemType {
  planKey: string;
}

function DashFeatures() {
  const { user } = useAuth() as AuthType;
  const { planKey } = user || {};

  const features =
    planKey && planKey in domainFeatures
      ? domainFeatures[planKey as keyof typeof domainFeatures]
      : [];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_3px_12px_rgba(15,23,42,0.04)] sm:p-7 lg:p-10">
      <header className="flex flex-col gap-5 border-b border-slate-100 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <span className="inline-flex rounded-md bg-emerald-50 px-2.5 py-1 text-[10px] font-bold tracking-[0.09em] text-emerald-600 sm:text-[11px]">
            INCLUDED PRIVILEGES
          </span>
          <h2 className="mt-2 text-lg font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">
            Your selected plan includes the following features:
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            All premium capabilities unlocked and available under your plan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
          <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-700">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Active Features
          </span>
          <span className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/70 px-3.5 py-2 text-xs font-medium text-amber-800">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            {user?.planKey}
          </span>
        </div>
      </header>

      <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
        {features?.map((feature, index) => (
          <li
            key={index}
            className="flex min-w-0 items-start gap-3 text-sm leading-5 text-slate-700"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
              <Check size={12} strokeWidth={2.8} aria-hidden="true" />
            </span>
            <span className="min-w-0 wrap-break-word">{feature.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default DashFeatures;
