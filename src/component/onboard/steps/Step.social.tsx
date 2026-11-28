import { Check, KeyRound, X } from "lucide-react";
import { PLATFORMS } from "../../../utils/onboard.data";
import type { StepProps } from "../../../utils/onboard.types";
import { Callout, FormField, SubHeading, TextArea } from "../Onboard.ui";

export const PlatformBadge = ({ id, size = "md" }: { id: string; size?: "sm" | "md" }) => {
  const p = PLATFORMS.find((x) => x.id === id);
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-lg font-bold text-white ${size === "sm" ? "size-6 text-[9px]" : "size-8 text-[11px]"}`}
      style={{ backgroundColor: p?.color ?? "#555" }}
    >
      {p?.short ?? "?"}
    </span>
  );
};

function StepSocial({ data, update, errors, platformLimit }: StepProps & { platformLimit: number }) {
  const selected = new Set(data.platforms);
  const atLimit = data.platforms.length >= platformLimit;
  const remaining = platformLimit - data.platforms.length;

  const toggle = (id: string) =>
    update({
      platforms: selected.has(id)
        ? data.platforms.filter((p) => p !== id)
        : atLimit
          ? data.platforms
          : [...data.platforms, id],
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F5F7FE] p-4">
        <div>
          <p className="text-[14px] font-semibold text-[#171a29]">
            {data.platforms.length} of {platformLimit} platforms selected
          </p>
          <p className="text-[13px] text-[#5e6375]">
            {atLimit
              ? "You've reached your plan's platform limit. Remove one to choose another."
              : `You can choose ${remaining} more.`}
          </p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#dce7ff] sm:w-48">
          <div className="h-full rounded-full bg-[#4331d2] transition-all" style={{ width: `${Math.min(100, (data.platforms.length / platformLimit) * 100)}%` }} />
        </div>
      </div>

      <div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {PLATFORMS.map((p) => {
            const isOn = selected.has(p.id);
            const disabled = !isOn && atLimit;
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={isOn}
                disabled={disabled}
                onClick={() => toggle(p.id)}
                className={`relative flex cursor-pointer items-center gap-2.5 rounded-xl border-2 p-3 text-left text-[14px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${isOn ? "border-[#4331d2] bg-[#F3F1FF] text-[#26214f]" : "border-[#E4E8F3] bg-white text-[#26344b] hover:border-[#4331d2]/40"}`}
              >
                <PlatformBadge id={p.id} />
                <span className="min-w-0 truncate">{p.label}</span>
                {isOn && <Check className="absolute right-2 top-2 size-4 text-[#4331d2]" />}
              </button>
            );
          })}
        </div>
        {errors.platforms && <p role="alert" className="mt-2 text-xs text-[#E53F41]">{errors.platforms}</p>}
      </div>

      <div className="space-y-3" aria-live="polite">
        <SubHeading title="Your selections" />
        {data.platforms.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[#d5dbec] p-4 text-center text-[13px] text-[#74798b]">
            No platforms selected yet. Choose the networks above.
          </p>
        ) : (
          <ul aria-label="Selected platforms" className="flex flex-wrap gap-2">
            {data.platforms.map((id) => {
              const meta = PLATFORMS.find((x) => x.id === id);
              return (
                <li key={id} className="inline-flex items-center gap-2 rounded-full border border-[#4331d2]/25 bg-white py-1 pl-1 pr-2 text-[13px] font-semibold text-[#26214f]">
                  <PlatformBadge id={id} size="sm" />
                  {meta?.label}
                  <button
                    type="button"
                    aria-label={`Remove ${meta?.label}`}
                    onClick={() => toggle(id)}
                    className="grid size-5 cursor-pointer place-items-center rounded-full text-[#8a91a8] hover:bg-[#FFF1F1] hover:text-[#E53F41]"
                  >
                    <X className="size-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Callout icon={<KeyRound className="size-4" />}>
        <strong>We never ask for your social passwords.</strong> After setup, BPS sends a secure
        connection link for each selected platform and you authorize access directly with the network.
      </Callout>

      <FormField label="Notes about your accounts" htmlFor="socialNotes" hint="Optional">
        <TextArea id="socialNotes" className="min-h-20" value={data.socialNotes} placeholder="Priorities, new accounts to create, admins we should know about…" onChange={(e) => update({ socialNotes: e.target.value })} />
      </FormField>
    </div>
  );
}

export default StepSocial;
