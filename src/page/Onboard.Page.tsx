import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  CircleCheck,
  Crown,
  Eraser,
  Image as ImageIcon,
  Loader2,
  Megaphone,
  Palette,
  Rocket,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useAuth } from "../redux/hooks";
import { getPlan } from "../utils/plan.config";
import { getCountry } from "../utils/countries";
import { DEMO_ONBOARD, EMPTY_ONBOARD, validateStep } from "../utils/onboard.data";
import type { OnboardData, OnboardRecord, StepErrors } from "../utils/onboard.types";
import { clearOnboard, loadOnboard, saveOnboard, submitOnboard } from "../services/demo.onboard.service";
import StepBusiness from "../component/onboard/steps/Step.business";
import StepBrand from "../component/onboard/steps/Step.brand";
import StepTrend from "../component/onboard/steps/Step.trend";
import StepApproval from "../component/onboard/steps/Step.approval";
import StepAssets from "../component/onboard/steps/Step.assets";
import StepSocial from "../component/onboard/steps/Step.social";
import StepGold from "../component/onboard/steps/Step.gold";
import StepReview from "../component/onboard/steps/Step.review";
import OnboardSubmitted from "../component/onboard/Onboard.submitted";

const steps = [
  { title: "Business", subtitle: "Name, contact & location", eyebrow: "STEP 01 • BUSINESS", heading: "Tell us about your business", description: "The basics we need to represent your brand accurately.", icon: Rocket },
  { title: "Brand Direction", subtitle: "Audience, voice & goals", eyebrow: "STEP 02 • BRAND DIRECTION", heading: "Define your brand direction", description: "The personality, audience, and boundaries that guide every post.", icon: Palette },
  { title: "Trend Context", subtitle: "Topics, seasons & events", eyebrow: "STEP 03 • TREND CONTEXT", heading: "Give us your content context", description: "What's happening in your business and industry so content stays timely.", icon: Sparkles },
  { title: "Approval Preference", subtitle: "No approval vs. review first", eyebrow: "STEP 04 • APPROVAL PREFERENCE", heading: "Choose your publishing approval", description: "Decide whether posts publish automatically or wait for your review.", icon: ShieldCheck, required: true },
  { title: "Brand Assets", subtitle: "Workspace, uploads & notes", eyebrow: "STEP 05 • ASSETS", heading: "Share your brand assets", description: "Logos, photos, videos, and guides we'll use to create your content.", icon: ImageIcon },
  { title: "Social Platforms", subtitle: "Networks to connect", eyebrow: "STEP 06 • SOCIAL PLATFORMS", heading: "Select your social platforms", description: "Choose the networks we'll publish to. BPS sends secure connection links after setup.", icon: Megaphone },
  { title: "MyBrandLife Gold", subtitle: "Included page benefit", eyebrow: "STEP 07 • MBL GOLD", heading: "Your MyBrandLife Gold benefit", description: "Every BPS plan includes a MyBrandLife Gold account and page.", icon: Crown },
  { title: "Review & Submit", subtitle: "Confirm & join the queue", eyebrow: "STEP 08 • REVIEW", heading: "Review and submit", description: "Check your answers, then submit to join the BPS provisioning queue.", icon: CircleCheck },
];

export default function OnboardPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const plan = getPlan(user?.planCode);
  const userId = user!.id;

  const [record, setRecord] = useState<OnboardRecord>(() => {
    const rec = loadOnboard(userId);
    if (rec.updatedAt || !user) return rec;
    // New draft: prefill what we already know from the MBL account.
    const name = `${user.firstName} ${user.lastName}`.trim();
    return {
      ...rec,
      data: {
        ...rec.data,
        contactName: name,
        contactEmail: user.email,
        contactPhone: user.phone,
        contactCountry: getCountry(user.phoneCountry).iso,
        primaryApprover: { ...rec.data.primaryApprover, name, email: user.email },
      },
    };
  });
  const [errors, setErrors] = useState<StepErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const { data, currentStep: current, maxStep } = record;
  const step = steps[current];
  const progress = Math.round(((current + 1) / steps.length) * 100);

  const persist = (next: OnboardRecord) => {
    const stamped = { ...next, updatedAt: new Date().toISOString() };
    setRecord(stamped);
    saveOnboard(userId, stamped);
  };

  const update = (patch: Partial<OnboardData>) => {
    const nextData = { ...data, ...patch };
    persist({ ...record, data: nextData });
    // Live re-validation: only keep errors that are still present.
    if (Object.keys(errors).length) {
      const fresh = validateStep(current, nextData, plan.platformLimit);
      setErrors(Object.fromEntries(Object.entries(fresh).filter(([k]) => k in errors)));
    }
  };

  const goTo = (index: number) => {
    setErrors({});
    persist({ ...record, currentStep: index, maxStep: Math.max(maxStep, index) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const focusFirstError = () =>
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>('main [aria-invalid="true"], main [role="alert"]');
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) el.focus({ preventScroll: true });
    });

  const goNext = async () => {
    const stepErrors = validateStep(current, data, plan.platformLimit);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length) {
      toast.error("Please complete the highlighted fields.");
      focusFirstError();
      return;
    }
    if (current < steps.length - 1) {
      goTo(current + 1);
      return;
    }
    setSubmitting(true);
    const submitted = await submitOnboard(userId, { ...record, updatedAt: new Date().toISOString() });
    setRecord(submitted);
    updateUser({ serviceStatus: "SETUP_IN_PROGRESS" });
    setSubmitting(false);
    toast.success("Onboarding submitted! You're in the provisioning queue.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fillDemo = () => {
    persist({ ...record, data: { ...DEMO_ONBOARD, confirmed: false } });
    setErrors({});
    toast.success("Demo data filled for every step.");
  };

  const clearForm = () => {
    persist({ ...record, data: EMPTY_ONBOARD, currentStep: 0, maxStep: 0 });
    setErrors({});
    toast("Form cleared.");
  };

  const restart = () => {
    clearOnboard(userId);
    updateUser({ serviceStatus: "SETUP_REQUIRED" });
    setRecord(loadOnboard(userId));
    setErrors({});
    toast("Onboarding reset for demo.");
  };

  const lastSaved = record.updatedAt
    ? new Date(record.updatedAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    : null;

  if (record.submittedAt) {
    return (
      <div className="min-h-screen bg-[#f5f7fe] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <OnboardSubmitted record={record} brandName={data.brandName} onRestart={restart} />
      </div>
    );
  }

  const stepProps = { data, update, errors };

  return (
    <div className="min-h-screen bg-[#f5f7fe] px-4 py-6 text-[#101426] sm:px-6 sm:py-9 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-xl bg-white p-5 shadow-[0_10px_40px_rgba(22,27,43,0.05)] sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-4">
              <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-[#4331d2] text-white shadow-sm">
                <Rocket className="size-6" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[18px] font-semibold tracking-[-.02em] sm:text-[20px]">BPS Onboarding & Setup</h1>
                  <span className="rounded-full bg-[#e8efff] px-2.5 py-1 text-[12px] font-semibold text-[#39415b]">
                    {plan.name} Managed Plan · {user?.billingCycle === "annual" ? "Annual" : "Monthly"}
                  </span>
                </div>
                <p className="mt-0.5 text-[14px] text-[#454a5c]">
                  Tell us about your brand, choose your approval preference, and pick your platforms.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#edf8f6] px-3 py-1.5 text-[12px] font-semibold text-[#176e66]">
                <span className="size-2 rounded-full bg-[#177a6d]" />
                {lastSaved ? `Auto-saved ${lastSaved}` : "Auto-save on"}
              </span>
              <button type="button" onClick={fillDemo} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#4331d2]/25 px-3 py-1.5 text-[12px] font-semibold text-[#4331d2] hover:bg-[#F3F1FF]">
                <Wand2 className="size-3.5" /> Fill demo data
              </button>
              <button type="button" onClick={clearForm} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold text-[#5e6375] hover:bg-[#F5F6FA]">
                <Eraser className="size-3.5" /> Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success("Progress saved. Continue any time.");
                  navigate("/");
                }}
                className="inline-flex cursor-pointer items-center gap-1.5 px-2 py-1.5 text-[13px] font-semibold text-[#252a3a] hover:text-[#4331d2]"
              >
                <Bookmark className="size-4" /> Save & Exit
              </button>
            </div>
          </div>
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between gap-3 text-[12px] font-bold">
              <span className="truncate text-[#3020c6]">
                Step {current + 1} of {steps.length} • {step.title}
              </span>
              <span className="shrink-0">{progress}% complete</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#dce7ff]">
              <div className="h-full rounded-full bg-[#4633d2] transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </header>

        {/* Compact step switcher for phones and tablets */}
        <nav aria-label="Onboarding steps" className="-mx-4 mt-4 overflow-x-auto px-4 pb-1 lg:hidden">
          <ol className="flex w-max gap-2">
            {steps.map((s, i) => {
              const reachable = i <= maxStep;
              return (
                <li key={s.title}>
                  <button
                    type="button"
                    disabled={!reachable}
                    onClick={() => goTo(i)}
                    aria-current={i === current ? "step" : undefined}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-semibold whitespace-nowrap transition disabled:opacity-50 ${i === current ? "border-[#4331d2] bg-[#4331d2] text-white" : reachable ? "cursor-pointer border-[#d9e0f2] bg-white text-[#26344b]" : "border-[#e4e8f3] bg-white text-[#8a91a8]"}`}
                  >
                    <span className={`grid size-5 place-items-center rounded-full text-[11px] ${i === current ? "bg-white/20" : i < maxStep || (i < current) ? "bg-[#4331d2] text-white" : "bg-[#E6ECFB]"}`}>
                      {i < current ? <Check className="size-3" /> : i + 1}
                    </span>
                    {s.title}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="mt-4 grid gap-6 lg:mt-7 lg:grid-cols-[290px_minmax(0,1fr)]">
          <aside className="hidden h-fit rounded-xl bg-white p-5 shadow-[0_10px_40px_rgba(22,27,43,0.05)] lg:sticky lg:top-24 lg:block">
            <div className="mb-4 flex items-center justify-between px-1">
              <span className="text-[12px] font-bold uppercase tracking-wide text-[#767b8d]">Onboarding steps</span>
              <span className="rounded-full bg-[#e8efff] px-2.5 py-1 text-[12px] font-semibold">{steps.length} steps</span>
            </div>
            <nav className="space-y-1">
              {steps.map((s, i) => {
                const reachable = i <= maxStep;
                return (
                  <button
                    type="button"
                    key={s.title}
                    onClick={() => reachable && goTo(i)}
                    disabled={!reachable}
                    aria-current={i === current ? "step" : undefined}
                    className={`group flex w-full items-center gap-3 rounded-md p-3 text-left transition ${i === current ? "bg-[#edf2ff]" : reachable ? "cursor-pointer hover:bg-[#f7f8fc]" : "cursor-default opacity-70"}`}
                  >
                    <span className={`grid size-7 shrink-0 place-items-center rounded-full text-[13px] font-semibold ${i === current ? "bg-[#3625c8] text-white" : i < maxStep || i < current ? "bg-[#4331d2] text-white" : "bg-[#dce8ff] text-[#1e2b52]"}`}>
                      {i !== current && (i < maxStep || i < current) ? <Check className="size-4" /> : i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] font-semibold ${i === current ? "text-[#3020c6]" : "text-[#1a1e2d]"}`}>
                        <span>{s.title}</span>
                        {s.required && <span className="shrink-0 rounded bg-[#ffe7e4] px-1.5 py-0.5 text-[10px] font-bold text-[#d9362e]">Required</span>}
                      </span>
                      <span className="mt-0.5 block truncate text-[12px] text-[#5e6375]">{s.subtitle}</span>
                    </span>
                  </button>
                );
              })}
            </nav>
            <div className="mt-6 rounded-md bg-[#edf2ff] p-4">
              <div className="flex gap-2 text-[#3426c6]">
                <ShieldCheck className="mt-0.5 size-4 shrink-0" />
                <div>
                  <p className="text-[13px] font-bold">Done-for-you, password-free</p>
                  <p className="mt-1 text-[12px] leading-[1.55] text-[#4f5568]">
                    BPS researches, creates, and publishes your content. You'll never be asked for social passwords.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <section className="min-w-0 rounded-xl bg-white p-5 shadow-[0_10px_40px_rgba(22,27,43,0.05)] sm:p-8 lg:p-9">
            <p className="text-[12px] font-bold tracking-[.02em] text-[#3324c9]">{step.eyebrow}</p>
            <h2 className="mt-2 text-[24px] font-bold tracking-[-.03em] sm:text-[30px]">{step.heading}</h2>
            <p className="mt-1.5 max-w-2xl text-[15px] leading-normal text-[#4f5567]">{step.description}</p>

            <div className="mt-7">
              {current === 0 && <StepBusiness {...stepProps} />}
              {current === 1 && <StepBrand {...stepProps} />}
              {current === 2 && <StepTrend {...stepProps} />}
              {current === 3 && <StepApproval {...stepProps} />}
              {current === 4 && <StepAssets {...stepProps} />}
              {current === 5 && <StepSocial {...stepProps} platformLimit={plan.platformLimit} />}
              {current === 6 && <StepGold {...stepProps} landerName={user?.landerName ?? ""} />}
              {current === 7 && <StepReview {...stepProps} goTo={goTo} />}
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#eceef3] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => goTo(Math.max(0, current - 1))}
                disabled={current === 0}
                className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md px-3 text-[14px] font-semibold text-[#52586b] transition hover:bg-[#f4f5f9] disabled:cursor-not-allowed disabled:text-[#b3b7c2] disabled:hover:bg-transparent"
              >
                <ArrowLeft className="size-4" /> Previous step
              </button>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:gap-3">
                <button
                  type="button"
                  onClick={() => toast.success("Draft saved.")}
                  className="h-11 cursor-pointer rounded-md px-4 text-[14px] font-semibold text-[#222738] hover:bg-[#f5f6fa]"
                >
                  Save as draft
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={submitting}
                  className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md bg-[#301fc3] px-6 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#2718ad] disabled:cursor-wait disabled:opacity-70 sm:min-w-52"
                >
                  {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
                  {current === steps.length - 1 ? (submitting ? "Submitting…" : "Submit setup") : "Save & continue"}
                  {!submitting && <ArrowRight className="size-4" />}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
