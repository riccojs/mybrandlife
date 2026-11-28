import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";
import { Check, ChevronDown } from "lucide-react";

const base =
  "w-full rounded-lg border bg-[#F5F7FE] px-4 text-[15px] text-[#1a2030] outline-none transition placeholder:text-[#9aa1b5] focus:bg-white focus:ring-2";
const ok = "border-transparent focus:border-[#4335d4] focus:ring-[#4335d4]/10";
const bad = "border-[#E53F41] bg-[#FFF8F8] focus:border-[#E53F41] focus:ring-[#E53F41]/10";

export function FormField({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <label htmlFor={htmlFor} className="text-[14px] font-semibold text-[#171a29]">
          {label}
          {required && <span className="ml-1 text-[#e43c3c]">*</span>}
        </label>
        {hint && <span className="text-[12px] text-[#74798b]">{hint}</span>}
      </div>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-[#E53F41]">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({ invalid, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return <input aria-invalid={invalid} className={`${base} h-12 ${invalid ? bad : ok} ${className ?? ""}`} {...props} />;
}

export function TextArea({ invalid, className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return <textarea aria-invalid={invalid} className={`${base} min-h-24 resize-y py-3 leading-6 ${invalid ? bad : ok} ${className ?? ""}`} {...props} />;
}

export function SelectInput({ invalid, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return (
    <div className="relative">
      <select aria-invalid={invalid} className={`${base} h-12 appearance-none truncate pr-10 ${invalid ? bad : ok}`} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#15192b]" />
    </div>
  );
}

export function Chip({ selected, onClick, children, disabled }: { selected: boolean; onClick: () => void; children: ReactNode; disabled?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
        selected ? "bg-[#351bc4] text-white shadow-sm hover:bg-[#2e17ad]" : "bg-[#E6ECFB] text-[#3b4460] hover:bg-[#d8e1f7]"
      }`}
    >
      {selected && <Check className="size-3.5" />}
      {children}
    </button>
  );
}

export function ChoiceCard({
  selected,
  onClick,
  title,
  description,
  badge,
  icon,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: ReactNode;
  badge?: string;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`flex w-full cursor-pointer gap-3 rounded-xl border-2 p-4 text-left transition sm:p-5 ${
        selected ? "border-[#4331d2] bg-[#F3F1FF]" : "border-[#E4E8F3] bg-white hover:border-[#4331d2]/40"
      }`}
    >
      <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 ${selected ? "border-[#4331d2] bg-[#4331d2]" : "border-[#b7bdd0]"}`}>
        {selected && <span className="size-2 rounded-full bg-white" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          {icon}
          <span className="text-[15px] font-semibold text-[#171a29]">{title}</span>
          {badge && <span className="rounded-full bg-[#E6ECFB] px-2 py-0.5 text-[11px] font-semibold text-[#4331d2]">{badge}</span>}
        </span>
        <span className="mt-1 block text-[13px] leading-5 text-[#5e6375]">{description}</span>
      </span>
    </button>
  );
}

export function Callout({ icon, children, tone = "info" }: { icon?: ReactNode; children: ReactNode; tone?: "info" | "warn" }) {
  return (
    <div className={`flex gap-3 rounded-xl p-4 text-[13px] leading-5 ${tone === "warn" ? "bg-[#FFF8EB] text-[#7A4E00]" : "bg-[#EEF2FF] text-[#3F4654]"}`}>
      {icon && <span className={`mt-0.5 shrink-0 ${tone === "warn" ? "text-[#C77700]" : "text-[#4331d2]"}`}>{icon}</span>}
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function SubHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <h3 className="text-[15px] font-bold text-[#171a29]">{title}</h3>
      {description && <p className="mt-0.5 text-[13px] text-[#5e6375]">{description}</p>}
    </div>
  );
}
