import { useState } from "react";
import { useNavigate } from "react-router";
import {
  pricingContent,
  signageCoreFees,
  signagePlans,
  socialPlans,
} from "../utils/pricing.data";
import type {
  BillingPeriod,
  PricingPlan,
  ProductMode,
} from "../utils/pricing.types";
import PricingPlanCard from "../component/pricing/Pricing.card";

const Pricing = () => {
  const [productMode, setProductMode] = useState<ProductMode>("social");
  const [billing, setBilling] = useState<BillingPeriod>("yearly");
  const [, setSelectedPlan] = useState<PricingPlan | null>(null);
  const navigate = useNavigate();
  const isSocial = productMode === "social";
  const plans = isSocial ? socialPlans : signagePlans;
  const content = isSocial ? pricingContent.social : pricingContent.signage;

  const handleProductChange = (product: ProductMode) => {
    setProductMode(product);
    setSelectedPlan(null);
  };

  const handleBillingChange = (period: BillingPeriod) => {
    setBilling(period);
    setSelectedPlan(null);
  };

  const handlePlanSelect = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    if (!isSocial) return;
    const params = new URLSearchParams({
      plan_code: plan.id,
      billing_cycle: billing === "yearly" ? "annual" : "monthly",
      source: "BPS",
    });
    navigate(`/get-started?${params.toString()}`);
  };

  return (
    <section className="min-h-screen">
      <div className="mx-auto max-w-7xl pb-16">
        <div className="mt-8 rounded-2xl bg-white p-5 border border-gray-200 sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2A65E9]">
                Pricing
              </p>

              <h1 className="mt-2 text-2xl font-medium capitalize tracking-[-0.03em] sm:text-3xl">
                One pricing page. Start with posting or screens.
              </h1>
              <p className="mt-1 max-w-3xl text-xs leading-5 text-[#5E6677] sm:text-sm">
                BrandPulse Social handles your social posting. SignPulse powers
                your in-house digital signage. Use either on its own or bundle
                them and unlock signage discounts.
              </p>
              <div className="mt-4 inline-flex max-w-full flex-wrap rounded-full bg-[#E9EBEF] p-1">
                <button
                  type="button"
                  onClick={() => handleProductChange("social")}
                  className={[
                    "rounded-full px-4 py-2 text-[11px] font-bold cursor-pointer",
                    "transition-all",
                    isSocial
                      ? "bg-white text-[#161B2B] shadow-sm"
                      : "text-[#667085]",
                  ].join(" ")}
                >
                  Social Posting
                  <span className="ml-2 text-[8px] uppercase tracking-[0.12em] text-[#2A65E9]">
                    Recommended
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleProductChange("signage")}
                  className={[
                    "rounded-full px-4 py-2 text-[11px] font-bold cursor-pointer",
                    "transition-all",
                    !isSocial
                      ? "bg-white text-[#161B2B] shadow-sm"
                      : "text-[#667085]",
                  ].join(" ")}
                >
                  Digital Signage Only
                </button>
              </div>
              <p className="mt-2 max-w-3xl text-xs leading-5 text-[#5E6677]">
                Pick your focus first —{" "}
                <strong>social posting or screens</strong> — then flip between{" "}
                <strong>monthly and yearly</strong>. Yearly pricing reflects the
                savings from your tables (including waived setup fees where
                applicable).
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <p
            className={[
              "text-[10px] font-bold uppercase tracking-[0.22em]",
              isSocial ? "text-[#2A65E9]" : "text-[#EF4444]",
            ].join(" ")}
          >
            {content.eyebrow}
          </p>

          <h2 className="mt-1 text-xl font-medium sm:text-2xl">
            {content.title}
          </h2>

          <p className="mt-2 max-w-3xl text-xs leading-4.25 text-[#5E6677]">
            {content.description}
          </p>
          <div className="flex items-start mt-5">
            <div className="inline-flex items-center rounded-full bg-[#E9EBEF] p-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#737B8C]">
                Billing
              </span>

              <button
                type="button"
                onClick={() => handleBillingChange("monthly")}
                className={[
                  "rounded-full px-3 py-2 text-[11px] font-bold cursor-pointer",
                  "transition-all",
                  billing === "monthly"
                    ? "bg-white shadow-sm"
                    : "text-[#667085]",
                ].join(" ")}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => handleBillingChange("yearly")}
                className={[
                  "rounded-full px-3 py-2 text-[11px] font-bold cursor-pointer",
                  "transition-all",
                  billing === "yearly"
                    ? "bg-white shadow-sm"
                    : "text-[#667085]",
                ].join(" ")}
              >
                Yearly
                <span className="ml-1.5 text-[8px] uppercase tracking-widest text-[#2A65E9]">
                  Recommended
                </span>
              </button>
            </div>
          </div>
        </div>
        {!isSocial && (
          <div className="mt-5 rounded-xl border border-[#161B2B]/5 bg-white px-4 py-3">
            <p className="text-[11px] font-bold text-[#3F4654]">
              {signageCoreFees.title}
            </p>

            <div className="mt-1 flex flex-wrap gap-x-2 text-[10px] leading-3.75 text-[#5E6677]">
              {signageCoreFees.description.map((item, index) => (
                <span key={item}>
                  {index > 0 && <span className="mr-2">·</span>}

                  {item}
                </span>
              ))}
            </div>

            <p className="text-[10px] text-[#5E6677]">{signageCoreFees.note}</p>
          </div>
        )}
        <div className="mt-5">
          <div
            className={[
              "grid gap-3",
              isSocial
                ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
                : "sm:grid-cols-2 xl:grid-cols-4",
            ].join(" ")}
          >
            {plans.map((plan) => (
              <PricingPlanCard
                key={plan.id}
                plan={plan}
                billing={billing}
                onSelect={handlePlanSelect}
              />
            ))}
          </div>
        </div>
        <div className="mt-3">
          <div className="rounded-xl border border-[#2A65E9]/30 bg-[#EAF1FF] px-4 py-3">
            <p className="text-xs leading-6 text-[#3F4654]">
              <strong className="text-[#2A65E9]">
                {content.bottomBannerTitle}
              </strong>{" "}
              {content.bottomBannerText}
            </p>
          </div>

          <p className="mt-2 text-[12px] text-[#667085]">
            {content.bottomNote}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
