import { ClipboardList, Clock3, Contact, Receipt } from "lucide-react";
import { useGetAllOnboardByDefaultQuery } from "../../redux/features/onboard/onboardApi";

interface DataTypes {
  data: {
    users: UserDataType[];
  };
  isLoading: boolean;
}

interface UserDataType {
  id: string | null;
  email: string | null;
  create_at: string | null;
  landerName: string | null;
  planPrice: number | null;
  profile: string | null;
  userTemplete: TemplateType[];
  discountType: string;
}

interface TemplateType {
  id: string | null;
  logo: string | null;
  create_at: string | null;
  tagLine: string | null;
  offerings: string | null;
}

function DashboardTabs({ data }: DataTypes) {
  const totalUser = data?.users?.length;
  const { data: getData } = useGetAllOnboardByDefaultQuery();
  const getUserData = data?.users?.filter((item) => {
    if (item?.discountType) {
      return item.discountType !== "LIFETIME";
    }
    return;
  });

  const totalEarning = getUserData?.reduce(
    (acc, item) => acc + (item?.planPrice || 0),
    0,
  );

  const totalOnboarding = getData?.onboard?.length;

  return (
    <section
      aria-label="Account summary"
      className="grid grid-cols-1 gap-2 md:gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      <article className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_2px_5px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-md sm:p-6">
        <div className="flex items-start justify-between gap-4 mb-2 md:mb-8">
          <div className="min-w-0">
            <p className="text-[11px] font-bold tracking-[0.08em] text-slate-400">
              JOINING USER
            </p>
            <h2 className="text-base font-semibold text-slate-900">
              Total User
            </h2>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600">
            <Contact size={21} strokeWidth={1.8} aria-hidden="true" />
          </div>
        </div>
        <p className="wrap-break-word text-md font-bold tracking-tight text-slate-900 sm:text-xl">
          {totalUser} User
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <Clock3 size={13} strokeWidth={2} aria-hidden="true" />
          <span>
            This section provides a comprehensive overview of the total number
            of users.
          </span>
        </p>
      </article>

      <article className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_2px_5px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-md sm:p-6">
        <div className="flex items-start justify-between gap-4 mb-2 md:mb-8">
          <div className="min-w-0">
            <p className="text-[11px] font-bold tracking-[0.08em] text-slate-400">
              EARNING
            </p>
            <h2 className="text-base font-semibold text-slate-900">
              Platform Earning
            </h2>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-100 bg-amber-50 text-amber-600">
            <Receipt size={22} strokeWidth={1.8} aria-hidden="true" />
          </div>
        </div>

        <p className="wrap-break-word text-md font-bold leading-snug tracking-tight text-slate-900 sm:text-xl">
          ${totalEarning}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-amber-700">
          <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500" />
          <span>This section highlights the platform's total earnings.</span>
        </p>
      </article>

      <article
        className={`min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_2px_5px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-md sm:p-6 sm:col-span-2 xl:col-span-1`}
      >
        <div className="flex items-start justify-between gap-4 mb-2 md:mb-8">
          <div className="min-w-0">
            <p className="text-[11px] font-bold tracking-[0.08em] text-slate-400 uppercase">
              onboarding
            </p>
            <h2 className="text-base font-semibold text-slate-900">
              Total Onboard
            </h2>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
            <ClipboardList size={22} strokeWidth={1.8} aria-hidden="true" />
          </div>
        </div>

        <p className="break-all text-md font-bold leading-snug tracking-tight text-slate-900 sm:text-xl">
          {totalOnboarding} People Onboard
        </p>
        <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs font-medium text-blue-600">
          <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
          <span>
            This section provides an overview of the total number of onboardings
          </span>
        </p>
      </article>
    </section>
  );
}

export default DashboardTabs;
