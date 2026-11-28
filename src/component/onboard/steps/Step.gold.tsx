import { Crown, Info } from "lucide-react";
import { MBL_GOLD_OPTIONS } from "../../../utils/onboard.data";
import type { StepProps } from "../../../utils/onboard.types";
import { Callout, ChoiceCard } from "../Onboard.ui";

function StepGold({ data, update, errors, landerName }: StepProps & { landerName: string }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl bg-linear-to-br from-[#1d1747] to-[#3a2bc0] p-5 text-white sm:flex-row sm:items-center">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/15">
          <Crown className="size-6 text-[#FFD66B]" />
        </span>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold">MyBrandLife Gold is included with your plan</p>
          <p className="mt-1 text-[13px] text-white/75">
            Your page: <span className="font-semibold text-white">mybrandlife.me/{landerName || "yourbrand"}</span>
          </p>
        </div>
      </div>

      <div role="radiogroup" aria-label="MyBrandLife Gold preference" className="grid gap-3">
        {MBL_GOLD_OPTIONS.map((opt) => (
          <ChoiceCard key={opt.id} selected={data.mblGold === opt.id} onClick={() => update({ mblGold: opt.id })} title={opt.title} description={opt.description} />
        ))}
      </div>
      {errors.mblGold && <p role="alert" className="-mt-3 text-xs text-[#E53F41]">{errors.mblGold}</p>}

      <Callout icon={<Info className="size-4" />}>
        Whatever you choose, the Gold entitlement stays on your account for as long as your BPS plan is active.
      </Callout>
    </div>
  );
}

export default StepGold;
