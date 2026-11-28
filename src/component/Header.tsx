import { startTransition, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { ChevronDown, LogOut, Menu, Rocket } from "lucide-react";
import Logo from "../assets/BPS-Logo-Wide.png";
import MobileHeader from "./Mobile.header";
import ConfirmDialog from "./common/Confirm.dialog";
import { useAuth } from "../redux/hooks";
import { getPlan } from "../utils/plan.config";
import { NAV_ITEMS, STATUS_LABEL } from "../utils/navigation";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `relative py-2 text-sm font-semibold transition-colors ${
    isActive
      ? "text-[#2A65E9] border-b-2 border-[#2A65E9]"
      : "text-[#161B2B]/70 hover:text-[#2A65E9] border-0"
  }`;

const Header = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Menus remember the page they were opened on, so they close automatically
  // as soon as the visitor navigates somewhere else.
  const [drawerOpenAt, setDrawerOpenAt] = useState<string | null>(null);
  const [menuOpenAt, setMenuOpenAt] = useState<string | null>(null);
  const isDrawerOpen = drawerOpenAt === pathname;
  const isMenuOpen = menuOpenAt === pathname;
  const menuRef = useRef<HTMLDivElement>(null);
  const [confirmingLogout, setConfirmingLogout] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpenAt(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpenAt(null);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [isMenuOpen]);

  // Sign out always asks for confirmation first.
  const requestLogout = () => {
    setMenuOpenAt(null);
    setDrawerOpenAt(null);
    setConfirmingLogout(true);
  };

  const confirmLogout = () => {
    setConfirmingLogout(false);
    // Navigate and sign out in one transition so the protected-page guard
    // never sees "signed out" while still on /onboard (it would redirect to sign-in).
    startTransition(() => {
      navigate("/", { replace: true });
      logout();
    });
    toast.success("You've been signed out.");
  };

  const initials = user
    ? `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase() || "U"
    : "";
  const plan = user ? getPlan(user.planCode) : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#161B2B]/8 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 md:h-20 lg:px-8">
        <Link to="/" className="shrink-0">
          <img src={Logo} alt="Brand Pulse Social" className="w-32 md:w-40 xl:w-44" />
        </Link>

        <nav aria-label="Main navigation" className="hidden lg:block">
          <ul className="flex items-center gap-6 xl:gap-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end className={navClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <>
              <Link
                to="/onboard"
                className="hidden h-10 items-center gap-2 rounded-xl bg-[#2A65E9] px-4 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#2058D0] md:inline-flex"
              >
                <Rocket className="size-4" />
                {user.serviceStatus === "SETUP_REQUIRED" ? "Continue setup" : "My setup"}
              </Link>
              <div ref={menuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpenAt(isMenuOpen ? null : pathname)}
                  aria-expanded={isMenuOpen}
                  aria-label="Account menu"
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-[#161B2B]/10 py-1 pl-1 pr-2 transition hover:border-[#2A65E9]/30 hover:bg-[#F8FAFF]"
                >
                  <span className="grid size-8 place-items-center rounded-full bg-[#2A65E9] text-xs font-bold text-white">
                    {initials}
                  </span>
                  <span className="hidden max-w-28 truncate text-sm font-semibold text-[#161B2B] sm:block">
                    {user.firstName}
                  </span>
                  <ChevronDown className={`size-4 text-[#161B2B]/50 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-72 overflow-hidden rounded-2xl border border-[#161B2B]/8 bg-white shadow-[0_20px_50px_rgba(22,27,43,0.15)]">
                    <div className="border-b border-[#161B2B]/8 p-4">
                      <p className="truncate text-sm font-semibold text-[#161B2B]">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="truncate text-xs text-[#161B2B]/55">{user.email}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-[#EAF1FF] px-2.5 py-1 text-[11px] font-semibold text-[#2A65E9]">
                          {plan?.name} · {user.billingCycle === "annual" ? "Annual" : "Monthly"}
                        </span>
                        <span className="rounded-full bg-[#FFF4E5] px-2.5 py-1 text-[11px] font-semibold text-[#9A5B00]">
                          {STATUS_LABEL[user.serviceStatus]}
                        </span>
                      </div>
                    </div>
                    <div className="p-2">
                      <Link to="/onboard" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#161B2B]/80 hover:bg-[#F5F7FE]">
                        <Rocket className="size-4" /> Onboarding & setup
                      </Link>
                      <button
                        type="button"
                        onClick={requestLogout}
                        className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-[#E53F41] hover:bg-[#FFF1F1]"
                      >
                        <LogOut className="size-4" /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <NavLink to="/auth/sign-in" className={(s) => `hidden md:block ${navClass(s)}`}>
                Sign In
              </NavLink>
              <Link
                to="/get-started"
                className="hidden h-10 items-center justify-center rounded-xl bg-[#2A65E9] px-5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#2058D0] hover:shadow-md sm:inline-flex"
              >
                Get started
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setDrawerOpenAt(pathname)}
            className="flex size-10 cursor-pointer items-center justify-center rounded-xl border border-[#161B2B]/10 text-[#161B2B] transition-colors hover:bg-[#F5F5F5] lg:hidden"
            aria-label="Open navigation menu"
            aria-expanded={isDrawerOpen}
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>
      <MobileHeader
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpenAt(null)}
        onLogout={requestLogout}
      />
      <ConfirmDialog
        open={confirmingLogout}
        tone="danger"
        icon={<LogOut className="size-5" />}
        title="Sign out of Brand Pulse Social?"
        description={
          <>
            You're signed in as <strong className="text-[#161B2B]">{user?.email}</strong>. Your
            onboarding progress is saved, so you can pick up where you left off.
          </>
        }
        confirmLabel="Sign out"
        cancelLabel="Stay signed in"
        onConfirm={confirmLogout}
        onCancel={() => setConfirmingLogout(false)}
      />
    </header>
  );
};

export default Header;
