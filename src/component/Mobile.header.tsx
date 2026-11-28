import { useEffect } from "react";
import { Link, NavLink } from "react-router";
import { LogOut, Rocket, X } from "lucide-react";
import Logo from "../assets/BPS-Logo-Wide.png";
import { useAuth } from "../redux/hooks";
import { NAV_ITEMS, STATUS_LABEL } from "../utils/navigation";
import { getPlan } from "../utils/plan.config";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const socials = [
  { href: "https://www.facebook.com/MyBrandLife", icon: "fa-facebook", label: "Facebook" },
  { href: "https://www.instagram.com/mybrandlife.me/", icon: "fa-instagram", label: "Instagram" },
  { href: "https://www.linkedin.com/company/mybrandlife/", icon: "fa-linkedin", label: "LinkedIn" },
  { href: "https://www.youtube.com/@MyBrandLife", icon: "fa-youtube", label: "YouTube" },
];

function MobileHeader({ isOpen, onClose, onLogout }: Props) {
  const { user } = useAuth();

  // Lock page scroll and allow Escape while the drawer is open.
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  return (
    <div className="lg:hidden" aria-hidden={!isOpen}>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 h-dvh bg-[#161B2B]/40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed left-0 top-0 z-50 flex h-dvh w-[min(20rem,85vw)] flex-col border-r border-gray-200 bg-white shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "invisible -translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <Link to="/" onClick={onClose}>
            <img src={Logo} alt="Brand Pulse Social" className="w-36" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="grid size-9 cursor-pointer place-items-center rounded-lg text-[#161B2B] hover:bg-[#F5F5F5]"
          >
            <X className="size-5" />
          </button>
        </div>

        {user && (
          <div className="mx-5 rounded-xl bg-[#F5F7FE] p-4">
            <p className="truncate text-sm font-semibold text-[#161B2B]">
              {user.firstName} {user.lastName}
            </p>
            <p className="truncate text-xs text-[#161B2B]/55">{user.email}</p>
            <p className="mt-2 text-[11px] font-semibold text-[#2A65E9]">
              {getPlan(user.planCode).name} · {STATUS_LABEL[user.serviceStatus]}
            </p>
          </div>
        )}

        <nav aria-label="Mobile navigation" className="mt-4 px-3">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${isActive ? "bg-[#EAF1FF] text-[#2A65E9]" : "text-[#161B2B]/75 hover:bg-[#F5F7FE]"}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-5 flex flex-col gap-2 px-5">
          {user ? (
            <>
              <Link
                to="/onboard"
                onClick={onClose}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2A65E9] text-sm font-semibold text-white hover:bg-[#2058D0]"
              >
                <Rocket className="size-4" />
                {user.serviceStatus === "SETUP_REQUIRED" ? "Continue setup" : "My setup"}
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#161B2B]/10 text-sm font-semibold text-[#E53F41] hover:bg-[#FFF1F1]"
              >
                <LogOut className="size-4" /> Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/get-started"
                onClick={onClose}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#2A65E9] text-sm font-semibold text-white hover:bg-[#2058D0]"
              >
                Get started
              </Link>
              <Link
                to="/auth/sign-in"
                onClick={onClose}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-[#161B2B]/10 text-sm font-semibold text-[#161B2B] hover:bg-[#F5F7FE]"
              >
                Log in
              </Link>
            </>
          )}
        </div>

        <div className="mt-auto px-5 pb-6">
          <div className="mb-3 flex gap-4">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="text-gray-400 hover:text-[#2A65E9]">
                <i className={`fa-brands ${s.icon}`} />
              </a>
            ))}
          </div>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} MyBrandLife.me. All rights reserved.
          </p>
        </div>
      </aside>
    </div>
  );
}

export default MobileHeader;
