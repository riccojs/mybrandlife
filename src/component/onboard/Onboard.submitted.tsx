import { useState } from "react";
import { Link } from "react-router";
import { CheckCircle2, ChevronDown, Circle, Clock, RotateCcw } from "lucide-react";
import type { OnboardRecord } from "../../utils/onboard.types";
import { OnboardSummary } from "./steps/Step.review";

const PROVISIONING = [
  "Workspace created",
  "Brand asset workspace ready",
  "Social connection links ready",
  "Approval preference applied",
  "Approvers configured",
  "Calendar & approval link ready",
  "Reports scheduled",
  "First content cycle ready",
];

const STAGES = ["Setup Required", "Setup in Progress", "Active"];

function OnboardSubmitted({ record, brandName, onRestart }: { record: OnboardRecord; brandName: string; onRestart: () => void }) {
  const [showAnswers, setShowAnswers] = useState(false);
  const submitted = record.submittedAt ? new Date(record.submittedAt) : new Date();
  const approval = record.data.approvalMode === "APPROVAL_REQUIRED";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-2xl bg-white p-6 text-center shadow-[0_10px_40px_rgba(22,27,43,0.06)] sm:p-10">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#E8F7F3] text-[#177a6d]">
          <CheckCircle2 className="size-9" />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-[-0.02em] text-[#161B2B] sm:text-3xl">Onboarding submitted</h1>
        <p className="mx-auto mt-3 max-w-xl text-[15px] leading-6 text-[#5e6375]">
          Thanks! <strong>{brandName}</strong> is now in the BPS provisioning queue. Our team will set up your
          workspace and email you when your connection links are ready.
        </p>
        <p className="mt-2 text-xs text-[#9aa1b5]">
          Submitted {submitted.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
        </p>

        <ol className="mx-auto mt-8 grid max-w-xl grid-cols-3 gap-2">
          {STAGES.map((stage, i) => (
            <li key={stage} className="flex flex-col items-center gap-2">
              <span className={`grid size-9 place-items-center rounded-full ${i === 0 ? "bg-[#177a6d] text-white" : i === 1 ? "bg-[#4331d2] text-white ring-4 ring-[#4331d2]/15" : "bg-[#E6ECFB] text-[#8a91a8]"}`}>
                {i === 0 ? <CheckCircle2 className="size-5" /> : i === 1 ? <Clock className="size-5" /> : <Circle className="size-5" />}
              </span>
              <span className={`text-center text-[12px] font-semibold sm:text-[13px] ${i === 1 ? "text-[#4331d2]" : "text-[#5e6375]"}`}>{stage}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-[0_10px_40px_rgba(22,27,43,0.06)]">
          <h2 className="text-[16px] font-bold text-[#161B2B]">What BPS is setting up</h2>
          <ul className="mt-4 space-y-2.5">
            {PROVISIONING.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-[14px] text-[#3b4460]">
                <Clock className="size-4 shrink-0 text-[#C77700]" />
                {item}
                <span className="ml-auto rounded-full bg-[#FFF4E5] px-2 py-0.5 text-[11px] font-semibold text-[#9A5B00]">Pending</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-[0_10px_40px_rgba(22,27,43,0.06)]">
          <h2 className="text-[16px] font-bold text-[#161B2B]">What happens next</h2>
          <ol className="mt-4 space-y-3 text-[14px] leading-6 text-[#3b4460]">
            <li><strong>1.</strong> We create your brand asset workspace{record.data.assetFiles.length ? ` and add the ${record.data.assetFiles.length} file${record.data.assetFiles.length === 1 ? "" : "s"} you uploaded` : ""}.</li>
            <li><strong>2.</strong> You receive a secure connection link for each of your {record.data.platforms.length} platforms.</li>
            <li><strong>3.</strong> {approval ? "Your approvers receive BPS-branded review requests before anything is published." : "We schedule and publish plan-covered content without a review step."}</li>
            <li><strong>4.</strong> You get your shared calendar link and scheduled reports.</li>
          </ol>
          <Link to="/support" className="mt-5 inline-block text-[13px] font-semibold text-[#4331d2] underline underline-offset-2">
            Questions? Contact support
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-[0_10px_40px_rgba(22,27,43,0.06)]">
        <button type="button" aria-expanded={showAnswers} onClick={() => setShowAnswers((s) => !s)} className="flex w-full cursor-pointer items-center justify-between p-6 text-left">
          <span className="text-[16px] font-bold text-[#161B2B]">Your submitted answers</span>
          <ChevronDown className={`size-5 text-[#5e6375] transition-transform ${showAnswers ? "rotate-180" : ""}`} />
        </button>
        {showAnswers && (
          <div className="px-4 pb-6 sm:px-6">
            <OnboardSummary data={record.data} goTo={() => {}} editable={false} />
          </div>
        )}
      </div>

      <div className="text-center">
        <button type="button" onClick={onRestart} className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-[#9aa1b5] hover:text-[#4331d2]">
          <RotateCcw className="size-3.5" /> Demo: restart onboarding
        </button>
      </div>
    </div>
  );
}

export default OnboardSubmitted;
