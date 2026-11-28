import { useEffect, useRef } from "react";

interface Props {
  /** Digits only, up to `length` characters. */
  value: string;
  onChange: (value: string) => void;
  /** Called once all boxes are filled (typing the last digit or pasting). */
  onComplete?: (value: string) => void;
  length?: number;
  disabled?: boolean;
  invalid?: boolean;
  autoFocus?: boolean;
  /** id of the error message, for aria-describedby. */
  describedBy?: string;
}

/**
 * One-time code input: one box per digit. Typing moves to the next box,
 * Backspace moves back, arrow keys move between boxes, and pasting (or SMS /
 * email autofill) spreads the digits across the boxes.
 */
function OtpInput({
  value,
  onChange,
  onComplete,
  length = 6,
  disabled,
  invalid,
  autoFocus,
  describedBy,
}: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  // After a wrong code the boxes are cleared (and were disabled while checking):
  // put the cursor back in the first box so the user can type again.
  useEffect(() => {
    if (autoFocus && !disabled && value === "") refs.current[0]?.focus();
  }, [autoFocus, disabled, value]);

  const focusBox = (index: number) => {
    const box = refs.current[Math.max(0, Math.min(length - 1, index))];
    box?.focus();
    box?.select();
  };

  const commit = (next: string, focusIndex: number) => {
    const clean = next.replace(/\D/g, "").slice(0, length);
    onChange(clean);
    focusBox(focusIndex);
    if (clean.length === length) onComplete?.(clean);
  };

  /** Writes `text` starting at box `index`, overwriting what's there. */
  const fillFrom = (index: number, text: string) => {
    const incoming = text.replace(/\D/g, "");
    if (!incoming) return;
    // A full-length code always replaces everything, wherever it's pasted.
    if (incoming.length >= length) {
      commit(incoming.slice(0, length), length - 1);
      return;
    }
    const arr = digits.slice();
    // Don't leave gaps: start no later than the first empty box.
    const start = Math.min(index, value.length);
    for (let i = 0; i < incoming.length && start + i < length; i++) arr[start + i] = incoming[i];
    commit(arr.join(""), start + incoming.length);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const arr = digits.slice();
      if (arr[index]) {
        arr[index] = "";
        // Shift later digits left so the code stays contiguous.
        commit(arr.join(""), index);
      } else if (index > 0) {
        arr[index - 1] = "";
        commit(arr.join(""), index - 1);
      }
    } else if (e.key === "Delete") {
      e.preventDefault();
      const arr = digits.slice();
      arr[index] = "";
      commit(arr.join(""), index);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusBox(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusBox(index + 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusBox(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusBox(length - 1);
    }
  };

  return (
    <div
      role="group"
      aria-label="Verification code"
      className="flex justify-center gap-2 sm:gap-3"
      onPaste={(e) => {
        e.preventDefault();
        if (disabled) return;
        const target = e.target as HTMLElement;
        const index = refs.current.findIndex((r) => r === target);
        fillFrom(index < 0 ? 0 : index, e.clipboardData.getData("text"));
      }}
    >
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          // Lets iOS/Android offer the emailed code; it arrives in the first box.
          autoComplete={i === 0 ? "one-time-code" : "off"}
          autoFocus={autoFocus && i === 0}
          maxLength={length}
          value={digit}
          disabled={disabled}
          aria-label={`Digit ${i + 1} of ${length}`}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          onFocus={(e) => e.target.select()}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onChange={(e) => {
            const typed = e.target.value.replace(/\D/g, "");
            if (!typed) return;
            // Usually 1 char; more when autofill drops the whole code into one box.
            // When a box already had a digit, the new one is whichever isn't the old one.
            const text = typed.length === 2 && digit && typed.includes(digit) ? typed.replace(digit, "") || digit : typed;
            fillFrom(i, text);
          }}
          className={`size-11 rounded-xl border bg-white text-center text-xl font-semibold text-[#161B2B] caret-[#2A65E9] shadow-sm outline-none transition sm:size-13 sm:text-2xl ${
            invalid
              ? "border-[#E53F41] ring-2 ring-[#E53F41]/10"
              : digit
                ? "border-[#2A65E9]/60 bg-[#F8FAFF]"
                : "border-[#d7d7d7]"
          } focus:border-[#2A65E9] focus:ring-4 focus:ring-[#2A65E9]/15 disabled:cursor-not-allowed disabled:opacity-60`}
        />
      ))}
    </div>
  );
}

export default OtpInput;
