import { useState } from "react";
import type { BillingPeriod, PricingPlan } from "../../utils/pricing.types";

interface PricingPlanCardProps {
  plan: PricingPlan;
  billing: BillingPeriod;
  onSelect: (plan: PricingPlan) => void;
}

const PricingPlanCard = ({ plan, billing, onSelect }: PricingPlanCardProps) => {
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const INITIAL_FEATURES = 3;
  const visibleFeatures = plan.features.slice(0, INITIAL_FEATURES);
  const extraFeatures = plan.features.slice(INITIAL_FEATURES);
  const hasExtraFeatures = extraFeatures.length > 0;
  const price = billing === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
  const setupFee =
    (billing === "yearly" ? plan.yearlySetupFee : plan.monthlySetupFee) ??
    plan.setupFee;

  return (
    <article
      className={[
        "relative flex h-full min-w-0 flex-col",
        "rounded-xl border bg-white p-4",
        "transition-all duration-300",
        plan.popular
          ? ["border-[#2A65E9]/30"].join(" ")
          : ["border-[#161B2B]/10"].join(" "),
      ].join(" ")}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <h3 className="text-md font-bold text-[#161B2B]">{plan.name}</h3>
        {plan.popular && (
          <span className="rounded-full bg-[#EAF1FF] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.15em] text-[#2A65E9]">
            Most Popular
          </span>
        )}
      </div>
      <p className="mt-1 min-h-7.5 text-xs leading-3.75 text-[#667085]">
        {plan.description}
      </p>
      <div>
        <div className="text-[18px] font-bold tracking-[-0.02em] text-[#161B2B]">
          {price}
        </div>
        <p className="mt-1 text-[11px] leading-3.5 text-[#667085]">
          Setup fee:{" "}
          <span className="font-medium text-[#3F4654]">{setupFee}</span>
        </p>
      </div>
      <div className="mt-4">
        <ul className="space-y-2">
          {visibleFeatures.map((feature, index) => (
            <li
              key={`${plan.id}-visible-${index}`}
              className="flex items-start gap-2 text-[11px] leading-3.5 text-[#3F4654]"
            >
              <span className="mt-1.25 h-1 w-1 shrink-0 rounded-full bg-[#3F4654]" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        {hasExtraFeatures && (
          <div
            className={[
              "grid transition-[grid-template-rows,opacity]",
              "duration-500 ease-in-out",

              showAllFeatures
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0",
            ].join(" ")}
          >
            <div className="min-h-0 overflow-hidden">
              <ul className="space-y-2 pt-2">
                {extraFeatures.map((feature, index) => (
                  <li
                    key={`${plan.id}-extra-${index}`}
                    className="flex items-start gap-2 text-[10.5px] leading-3.5 text-[#3F4654]"
                  >
                    <span className="mt-1.25 h-1 w-1 shrink-0 rounded-full bg-[#3F4654]" />

                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {hasExtraFeatures && (
          <button
            type="button"
            aria-expanded={showAllFeatures}
            onClick={() => setShowAllFeatures((previous) => !previous)}
            className="mt-3 cursor-pointer rounded-full border border-[#161B2B]/10 bg-white px-3 py-1.5 text-[10px] font-bold text-[#161B2B] transition-all duration-200 hover:border-[#2A65E9]/30 hover:bg-[#F8FAFF] hover:text-[#2A65E9]"
          >
            {showAllFeatures ? "Hide extra features" : "Show all features"}
          </button>
        )}
      </div>
      <div className="mt-auto pt-3">
        <button
          type="button"
          onClick={() => onSelect(plan)}
          className="w-full rounded-full bg-[#2A65E9] px-3 py-2.5 text-[10px] font-bold leading-3.25 text-white transition-all duration-200 hover:bg-[#2058D1] hover:shadow-[0_6px_18px_rgba(42,101,233,0.20)] active:scale-[0.98]"
        >
          {plan.buttonText}
        </button>
        {plan.secondaryButtonText && (
          <button
            type="button"
            onClick={() => onSelect(plan)}
            className="mt-2 w-full rounded-full border border-[#161B2B]/10 bg-white px-3 py-2.5 text-[10px] font-bold leading-3.25 text-[#161B2B] transition-all duration-200 hover:border-[#2A65E9]/30 hover:bg-[#F8FAFF] hover:text-[#2A65E9] active:scale-[0.98]"
          >
            {plan.secondaryButtonText}
          </button>
        )}
      </div>
    </article>
  );
};

export default PricingPlanCard;
