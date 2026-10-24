import BannerImg from "../../assets/banner_img-DaEcZgVi.png";
import { Link } from "react-router";
import { useAuth } from "../../hook/useAuth";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface AuthType {
  user: ItemType | null;
}

interface ItemType {
  username: string;
  lastName: string;
  email: string;
  status: string;
}

function DashboardHeader() {
  const { user } = useAuth() as AuthType;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night 🌙";
  };

  return (
    <section className="relative isolate overflow-hidden rounded-[28px] border border-gray-200 bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-[58%] bg-[radial-gradient(ellipse_at_68%_45%,rgba(16,185,129,0.16),rgba(209,250,229,0.16)_40%,rgba(255,255,255,0)_73%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-24 -z-10 h-64 w-64 rounded-full bg-emerald-100/30 blur-3xl"
      />

      <div className="grid min-h-90 grid-cols-1 items-center gap-10 px-5 py-8 sm:px-10 sm:py-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8 lg:px-10 xl:px-12">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-3 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-[0.08em] text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
            {getGreeting()}
          </div>

          <h1 className="text-2xl md:text-4xl capitalize font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl xl:text-5xl">
            {user?.lastName}{" "}
            <span
              aria-hidden="true"
              className="inline-block text-xl md:text-4xl"
            >
              👋
            </span>
          </h1>

          <h2 className="mt-3 max-w-2xl text-xl md:text-2xl font-medium leading-tight tracking-tight text-slate-800 sm:text-3xl xl:text-[32px]">
            Welcome Back
          </h2>

          <p className="mt-2 text-base font-semibold text-slate-700 sm:text-lg">
            Streamline Operations with the Admin Dashboard
          </p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-[15px] sm:leading-7">
            Admin Dashboard provides a centralized hub where administrators can
            manage every aspect of the system in one place. From monitoring user
            activity and managing roles, to handling content, settings,
            payments, and reports—everything is accessible in an intuitive
            interface designed for efficiency.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/onboard"
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-linear-to-r from-[#b8ed69] to-[#96c94b] px-6 py-3 text-xs md:text-sm font-bold text-black shadow-[0_8px_18px_rgba(16,185,129,0.22)] transition activer:scale-[0.98] hover:from-[#96c94b] hover:to-[#b8ed69] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              Check Onboard
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/user"
              className="inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-xl border border-slate-300 bg-white/75 px-6 py-2 text-xs font-medium text-slate-500 sm:self-auto sm:text-sm w-full md:w-fit"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Users
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-130 lg:ml-auto lg:mr-0">
          <div
            aria-hidden="true"
            className="absolute -inset-4 rounded-4xl bg-emerald-200/30 blur-2xl"
          />
          <div className="relative overflow-hidden rounded-[22px] border border-slate-300 bg-slate-950 shadow-[0_24px_50px_rgba(15,23,42,0.20)]">
            <img
              src={BannerImg}
              alt="MyBrandLife dashboard preview"
              className="aspect-[1.48/1] w-full object-cover object-top"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-linear-to-t from-slate-950/85 via-slate-900/45 to-transparent px-4 pb-4 pt-16 sm:px-5">
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-slate-900/75 px-3 py-1.5 text-xs font-medium text-white backdrop-blur uppercase">
                <CheckCircle2 size={14} className="text-emerald-400" />
                {user?.status}
              </span>
              <span className="max-w-[45%] truncate text-xs font-semibold text-emerald-300 sm:text-sm">
                {user?.email}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardHeader;
