import { useState, type InputHTMLAttributes, type SelectHTMLAttributes } from "react";
import { ChevronDown, Eye, EyeOff, Loader2 } from "lucide-react";

export const authInputClass =
  "h-11 w-full rounded-full border border-[#d7d7d7] bg-white px-4 text-[14px] outline-none transition focus:border-[#2A65E9] focus:ring-2 focus:ring-[#2A65E9]/10 aria-[invalid=true]:border-[#E53F41] aria-[invalid=true]:ring-[#E53F41]/10";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

export function AuthField({ id, label, error, className, ...props }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-[13px] font-medium text-[#252525]">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${authInputClass} ${className ?? ""}`}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 pl-3 text-xs text-[#E53F41]">
          {error}
        </p>
      )}
    </div>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  error?: string;
}

export function AuthSelect({ id, label, error, className, children, ...props }: SelectProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-[13px] font-medium text-[#252525]">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${authInputClass} cursor-pointer appearance-none truncate pr-10 ${className ?? ""}`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#777]" />
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 pl-3 text-xs text-[#E53F41]">
          {error}
        </p>
      )}
    </div>
  );
}

export function PasswordField({ id, label, error, ...props }: FieldProps) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-[13px] font-medium text-[#252525]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${authInputClass} pr-11`}
          {...props}
        />
        <button
          type="button"
          aria-label={show ? "Hide password" : "Show password"}
          onClick={() => setShow((s) => !s)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-[#777] hover:text-[#2A65E9]"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 pl-3 text-xs text-[#E53F41]">
          {error}
        </p>
      )}
    </div>
  );
}

export function SubmitButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#2A65E9] text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#2058D0] hover:shadow-[0_8px_25px_rgba(42,101,233,0.25)] active:scale-[0.99] disabled:cursor-wait disabled:opacity-75"
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}
