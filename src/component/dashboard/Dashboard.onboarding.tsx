import { useMemo, useState } from "react";
import { CalendarDays, ChevronDown, ChevronRight } from "lucide-react";
import RecentUserLoader from "../loader/Recent.loader";
import { Link } from "react-router";

function CreatorAvatar({ index }: { index: number }) {
  const shirtColors = [
    "#6366f1",
    "#8b5cf6",
    "#3b82f6",
    "#0d9488",
    "#ec4899",
    "#f97316",
  ];
  const shirtColor = shirtColors[index % shirtColors.length];
  return (
    <div className="relative h-16 w-16 shrink-0">
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-slate-200">
        <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden="true">
          <path d="M27 38h10v10H27z" fill="#b96d4c" />
          <path d="M13 62c1-12 8-19 19-19s18 7 19 19" fill={shirtColor} />
          <ellipse cx="32" cy="27" rx="17" ry="20" fill="#263548" />
          <ellipse cx="32" cy="29" rx="12" ry="14" fill="#bd7958" />
          <path
            d="M20 24c0-12 6-17 13-17 8 0 13 6 13 16l-5-6-8-3-9 4z"
            fill="#1e293b"
          />
          <circle
            cx="27"
            cy="29"
            r="4.5"
            fill="#38bdf8"
            stroke="#172033"
            strokeWidth="2"
          />
          <circle
            cx="38"
            cy="29"
            r="4.5"
            fill="#38bdf8"
            stroke="#172033"
            strokeWidth="2"
          />
          <path d="M31.5 29h2" stroke="#172033" strokeWidth="2" />
        </svg>
      </div>
      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
    </div>
  );
}

interface DataTypes {
  data: {
    users: UserDataType[];
    templates: TemplateType[];
  };
  isLoading: boolean;
}

interface UserDataType {
  id: string | null;
  email: string | null;
  create_at: string;
  firstName: string;
  status: string;
  lastName: string;
  landerName: string | null;
  planPrice: number | null;
  profile: string | null;
  userTemplete: TemplateType[];
  discountType: string;
}

interface TemplateType {
  id: string | null;
  logo: string | null;
  create_at: string;
  tagLine: string | null;
  offerings: string | null;
  status: string;
  logoImage: string;
  bio: string;
  layout: string;
  user: UserDataType;
}

function DashboardOnboarding({ data, isLoading }: DataTypes) {
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);

  const pageSize = 5;

  const changeSort = (value: "newest" | "oldest") => {
    setSortOrder(value);
    setPage(1);
  };

  const formattedDate = (value: string) => {
    const createDate = new Date(value);
    return createDate?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const inReviewUser = data?.templates?.filter(
    (item) => item.status !== "ACTIVATE",
  )?.length;

  const sortOnboard = useMemo(() => {
    return [...(data?.templates ?? [])].sort((a, b) => {
      const dateA = new Date(a.create_at).getTime();
      const dateB = new Date(b.create_at).getTime();

      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [data?.templates, sortOrder]);

  const paginatedUsers = sortOnboard.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  // decide what to render
  let content;
  if (isLoading) {
    content = (
      <>
        <RecentUserLoader />
        <RecentUserLoader />
        <RecentUserLoader />
        <RecentUserLoader />
        <RecentUserLoader />
        <RecentUserLoader />
      </>
    );
  }
  if (!isLoading && paginatedUsers?.length === 0) {
    content = <p>Data not found</p>;
  }
  if (!isLoading && paginatedUsers?.length > 0) {
    content = paginatedUsers?.map((creator) => {
      const { layout, create_at, bio, user, id, logoImage, status } =
        creator || {};
      return (
        <article
          key={id}
          className="flex flex-col md:flex-row min-w-0 items-center gap-3 border-b border-slate-100 px-5 py-5 transition-colors hover:bg-slate-50/70 sm:gap-4 sm:px-6"
        >
          {logoImage ? (
            <div className="relative w-14 min-w-14 h-14 rounded-full">
              <img
                src={logoImage}
                alt={logoImage}
                className="w-full h-full object-cover rounded-full"
              />
              <span
                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${status === "ACTIVATE" ? "bg-emerald-500" : "bg-res-500"}`}
              />
            </div>
          ) : (
            <CreatorAvatar
              index={data?.users.findIndex((item) => item.id === creator.id)}
            />
          )}
          <div className="min-w-0 flex md:flex-1 flex-col md:items-start items-center">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="capitalize wrap-break-word text-sm font-bold leading-5 text-slate-900 sm:text-base">
                {`${user?.firstName} ${user?.lastName}`}
              </h3>
              <span
                className={`inline-flex rounded border px-2 py-0.5 text-[10px] font-medium border-blue-100 bg-blue-50 text-blue-700`}
              >
                LAYOUT: {layout}
              </span>
            </div>
            <p className="mt-1 wrap-break-word text-sm leading-5 text-slate-600">
              {bio?.slice(0, 30)}..
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
              <CalendarDays size={13} />
              <time>{formattedDate(create_at)}</time>
            </div>
          </div>
          <Link
            to={`/onboard/update/${id}`}
            className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:px-3.5 sm:py-2 sm:text-sm"
          >
            Manage
          </Link>
        </article>
      );
    });
  }

  return (
    <section className="overflow-hidden w-full md:w-6/12 rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 px-5 pb-5 pt-6 sm:px-6">
        <div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-slate-900">
            Recent Onboardings
          </h2>
          <div className="mt-2 h-1 w-16 rounded-full bg-emerald-500" />
        </div>
        <Link
          to="/onboard"
          className="flex shrink-0 items-center gap-1 text-xs md:text-sm font-medium text-rose-600 transition hover:text-rose-700"
        >
          See all
          <ChevronRight size={16} />
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 px-5 py-3 sm:px-6">
        <SummaryBadge
          label="Total Onboard:"
          value={data?.templates?.length ?? 0}
          className="bg-slate-100 text-slate-700"
          dotClassName="bg-emerald-500"
        />
        <SummaryBadge
          label="In Review:"
          value={inReviewUser}
          className="border border-amber-100 bg-amber-50 text-amber-800"
          dotClassName="bg-amber-500"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-slate-100 bg-slate-50/70 px-5 py-3 text-xs sm:px-6">
        <span className="text-slate-600">Showing latest records</span>
        <label className="flex items-center gap-1.5 text-slate-500">
          Sort by:
          <span className="relative inline-flex items-center">
            <select
              value={sortOrder}
              onChange={(event) =>
                changeSort(event.target.value as "newest" | "oldest")
              }
              className="cursor-pointer appearance-none bg-transparent pr-5 font-semibold text-slate-800 outline-none"
              aria-label="Sort creators by date"
            >
              <option value="newest">Date (Newest)</option>
              <option value="oldest">Date (Oldest)</option>
            </select>
            <ChevronDown
              size={13}
              className="pointer-events-none absolute right-0"
            />
          </span>
        </label>
      </div>
      <div>{content}</div>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 px-4 py-4 sm:px-5">
        <p className="text-xs text-slate-500">
          Showing {sortOnboard.length === 0 ? 0 : (page - 1) * pageSize + 1}
          {"–"}
          {Math.min(page * pageSize, sortOnboard.length)} of{" "}
          {sortOnboard.length} onboard
        </p>
        <div className="flex items-center gap-2">
          <Link
            to="/onboard"
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Check All
          </Link>
        </div>
      </div>
    </section>
  );
}

interface SummaryBadgeProps {
  label: string;
  value: string | number;
  className: string;
  dotClassName: string;
}

function SummaryBadge({
  label,
  value,
  className,
  dotClassName,
}: SummaryBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotClassName}`} />
      <span>{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

export default DashboardOnboarding;
