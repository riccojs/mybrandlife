import { CalendarDays, Clock3, Globe2, Star } from "lucide-react";
import { useAuth } from "../../hook/useAuth";

interface AuthType {
  user: ItemType | null;
}

interface ItemType {
  midName: string | null;
  create_at: string | null;
  package: string | null;
  frequency: string | null;
  domain: string | null;
  landerName: string | null;
}

export default function DashTabs() {
  const { user } = useAuth() as AuthType;
  const {
    create_at,
    package: pkgType,
    frequency,
    domain,
    landerName,
  } = user || {};

  const daysAgo = create_at
    ? Math.floor(
        (Date.now() - new Date(create_at).getTime()) / (1000 * 60 * 60 * 24),
      )
    : 0;

  const formattedDate = (value: string) => {
    const createDate = new Date(value);
    return createDate?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  return (
    <section
      aria-label="Account summary"
      className="grid grid-cols-1 gap-2 md:gap-4 sm:grid-cols-2 xl:grid-cols-3 my-2 md:my-5"
    >
      <article className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_2px_5px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-md sm:p-6">
        <div className="flex items-start justify-between gap-4 mb-2 md:mb-8">
          <div className="min-w-0">
            <p className="text-[11px] font-bold tracking-[0.08em] text-slate-400">
              ACCOUNT TIMELINE
            </p>
            <h2 className="text-base font-semibold text-slate-900">
              Joined On
            </h2>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600">
            <CalendarDays size={21} strokeWidth={1.8} aria-hidden="true" />
          </div>
        </div>
        <p className="wrap-break-word text-md font-bold tracking-tight text-slate-900 sm:text-xl">
          {formattedDate(create_at ? create_at : "")}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <Clock3 size={13} strokeWidth={2} aria-hidden="true" />
          <span>
            Joined {daysAgo} day{daysAgo !== 1 ? "s" : ""} ago!
          </span>
        </p>
      </article>

      <article className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_2px_5px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-md sm:p-6">
        <div className="flex items-start justify-between gap-4 mb-2 md:mb-8">
          <div className="min-w-0">
            <p className="text-[11px] font-bold tracking-[0.08em] text-slate-400">
              MEMBERSHIP
            </p>
            <h2 className="text-base font-semibold text-slate-900">
              Subscription Tier
            </h2>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-100 bg-amber-50 text-amber-600">
            <Star size={22} strokeWidth={1.8} aria-hidden="true" />
          </div>
        </div>

        <p className="wrap-break-word capitalize text-md font-bold leading-snug tracking-tight text-slate-900 sm:text-xl">
          Chosen Package: {pkgType}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-amber-700">
          <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500" />
          <span>Your tier is {frequency}</span>
        </p>
      </article>

      <article
        className={`min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_2px_5px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-md sm:p-6 sm:col-span-2 xl:col-span-1`}
      >
        <div className="flex items-start justify-between gap-4 mb-2 md:mb-8">
          <div className="min-w-0">
            <p className="text-[11px] font-bold tracking-[0.08em] text-slate-400">
              WEB PRESENCE
            </p>
            <h2 className="text-base font-semibold text-slate-900">
              Selected Domain
            </h2>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
            <Globe2 size={22} strokeWidth={1.8} aria-hidden="true" />
          </div>
        </div>

        <p className="break-all capitalize text-md font-bold leading-snug tracking-tight text-slate-900 sm:text-xl">
          Chosen Domain: {domain}
        </p>
        <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs font-medium text-blue-600">
          <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
          <span>Your landername is {landerName}</span>
        </p>
      </article>
    </section>
  );
}
