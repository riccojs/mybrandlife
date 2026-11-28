import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { COUNTRIES, formatPhone, getCountry, isAvailableCountry, phonePlaceholder } from "../../utils/countries";

interface Props {
  id: string;
  country: string;
  phone: string;
  onChange: (next: { country: string; phone: string }) => void;
  invalid?: boolean;
  /** "auth" = rounded pill inputs (register); "onboard" = filled onboarding inputs. */
  variant?: "auth" | "onboard";
}

const styles = {
  auth: {
    wrap: "h-11 rounded-full border border-[#d7d7d7] bg-white focus-within:border-[#2A65E9] focus-within:ring-2 focus-within:ring-[#2A65E9]/10",
    bad: "border-[#E53F41] ring-[#E53F41]/10",
    button: "rounded-l-full pl-4 pr-2 border-r border-[#e5e5e5]",
    input: "text-[14px] px-3",
  },
  onboard: {
    wrap: "h-12 rounded-lg border border-transparent bg-[#F5F7FE] focus-within:border-[#4335d4] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#4335d4]/10",
    bad: "border-[#E53F41] bg-[#FFF8F8]",
    button: "rounded-l-lg pl-3.5 pr-2 border-r border-[#dfe5f5]",
    input: "text-[15px] px-3",
  },
};

function PhoneField({ id, country, phone, onChange, invalid, variant = "auth" }: Props) {
  const s = styles[variant];
  const listId = useId();
  const current = getCountry(country);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  // Digits that sit before the caret, so the caret can be restored after reformatting.
  const caretDigits = useRef<number | null>(null);

  useLayoutEffect(() => {
    const el = phoneRef.current;
    if (caretDigits.current === null || !el || document.activeElement !== el) return;
    let seen = 0;
    let pos = 0;
    while (pos < phone.length && seen < caretDigits.current) {
      if (/\d/.test(phone[pos])) seen++;
      pos++;
    }
    el.setSelectionRange(pos, pos);
    caretDigits.current = null;
  }, [phone]);

  const handleType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, selectionStart } = e.target;
    caretDigits.current = value.slice(0, selectionStart ?? value.length).replace(/\D/g, "").length;
    onChange({ country: current.iso, phone: formatPhone(value, current.iso) });
  };

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    // Available countries first, then the rest (shown but disabled).
    const sorted = [...COUNTRIES].sort((a, b) => Number(!!b.available) - Number(!!a.available));
    if (!q) return sorted;
    return sorted.filter(
      (c) => c.name.toLowerCase().includes(q) || c.dial.includes(q.replace(/^\+?/, "+")) || c.iso.toLowerCase() === q,
    );
  }, [query]);

  // Start every open with a fresh search.
  const openPicker = () => {
    setQuery("");
    setActive(Math.max(0, COUNTRIES.filter((c) => c.available).findIndex((c) => c.iso === current.iso)));
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();
    const onDown = (e: MouseEvent) => !rootRef.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const choose = (iso: string) => {
    if (!isAvailableCountry(iso)) return;
    onChange({ country: iso, phone: formatPhone(phone, iso) });
    setOpen(false);
    setQuery("");
    phoneRef.current?.focus();
  };

  const onSearchKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => {
        const next = matches.findIndex((c, i) => i > a && c.available);
        return next === -1 ? a : next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => {
        for (let i = a - 1; i >= 0; i--) if (matches[i].available) return i;
        return a;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = matches[active]?.available ? matches[active] : matches.find((c) => c.available);
      if (target) choose(target.iso);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <div className={`flex items-stretch transition ${s.wrap} ${invalid ? s.bad : ""}`}>
        <button
          type="button"
          aria-label={`Country code: ${current.name} ${current.dial}`}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => (open ? setOpen(false) : openPicker())}
          className={`flex shrink-0 cursor-pointer items-center gap-1.5 text-[14px] font-medium text-[#1a2030] hover:bg-black/3 ${s.button}`}
        >
          <span className="text-base leading-none">{current.flag}</span>
          <span>{current.dial}</span>
          <ChevronDown className={`size-3.5 text-[#777] transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        <input
          ref={phoneRef}
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          aria-invalid={invalid}
          placeholder={phonePlaceholder(current.iso)}
          value={phone}
          onChange={handleType}
          className={`min-w-0 flex-1 bg-transparent text-[#1a2030] outline-none placeholder:text-[#9aa1b5] ${s.input}`}
        />
      </div>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-30 w-full min-w-64 overflow-hidden rounded-xl border border-[#e4e8f3] bg-white shadow-[0_16px_40px_rgba(22,27,43,0.14)] sm:w-80">
          <div className="flex items-center gap-2 border-b border-[#eef0f5] px-3">
            <Search className="size-4 shrink-0 text-[#9aa1b5]" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onSearchKey}
              placeholder="Search country or code"
              aria-label="Search countries"
              aria-controls={listId}
              className="h-10 w-full bg-transparent text-[14px] outline-none"
            />
          </div>
          <ul id={listId} role="listbox" aria-label="Countries" className="max-h-60 overflow-y-auto py-1">
            {matches.length === 0 && <li className="px-4 py-3 text-[13px] text-[#9aa1b5]">No matching country</li>}
            {matches.map((c, i) => {
              const selected = c.iso === current.iso;
              const disabled = !c.available;
              return (
                <li
                  key={c.iso}
                  role="option"
                  aria-selected={selected}
                  aria-disabled={disabled}
                  title={disabled ? "Not available yet" : undefined}
                  onMouseEnter={() => !disabled && setActive(i)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (!disabled) choose(c.iso);
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2 text-[14px] ${disabled ? "cursor-not-allowed opacity-45" : `cursor-pointer ${i === active ? "bg-[#F3F5FD]" : ""}`}`}
                >
                  <span className="text-base leading-none">{c.flag}</span>
                  <span className="min-w-0 flex-1 truncate text-[#1a2030]">{c.name}</span>
                  {disabled ? (
                    <span className="shrink-0 rounded-full bg-[#F1F2F6] px-2 py-0.5 text-[11px] font-semibold text-[#74798b]">Not available yet</span>
                  ) : (
                    <span className="shrink-0 text-[#74798b]">{c.dial}</span>
                  )}
                  {selected && <Check className="size-4 shrink-0 text-[#2A65E9]" />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PhoneField;
