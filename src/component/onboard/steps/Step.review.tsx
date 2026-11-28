import type { ReactNode } from "react";
import { Pencil } from "lucide-react";
import { ASSET_CATEGORIES, MBL_GOLD_OPTIONS, PLATFORMS } from "../../../utils/onboard.data";
import { getCountry } from "../../../utils/countries";
import type { OnboardData, StepErrors } from "../../../utils/onboard.types";

const Row = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="grid gap-0.5 py-2 sm:grid-cols-[180px_1fr] sm:gap-4">
    <dt className="text-[13px] text-[#74798b]">{label}</dt>
    <dd className="min-w-0 break-words text-[14px] text-[#171a29]">
      {value === "" || value === null || value === undefined ? <span className="text-[#b0b5c4]">—</span> : value}
    </dd>
  </div>
);

const Section = ({ title, onEdit, children, editable }: { title: string; onEdit: () => void; children: ReactNode; editable: boolean }) => (
  <section className="rounded-xl border border-[#E4E8F3] p-4 sm:p-5">
    <div className="mb-1 flex items-center justify-between gap-3">
      <h3 className="text-[15px] font-bold text-[#171a29]">{title}</h3>
      {editable && (
        <button type="button" onClick={onEdit} className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-[13px] font-semibold text-[#4331d2] hover:bg-[#F3F1FF]">
          <Pencil className="size-3.5" /> Edit
        </button>
      )}
    </div>
    <dl className="divide-y divide-[#F0F2F7]">{children}</dl>
  </section>
);

export function OnboardSummary({ data, goTo, editable = true }: { data: OnboardData; goTo: (step: number) => void; editable?: boolean }) {
  const dial = getCountry(data.contactCountry).dial;
  const platformLabel = (id: string) => PLATFORMS.find((p) => p.id === id)?.label ?? id;
  return (
    <div className="space-y-4">
      <Section title="Business" onEdit={() => goTo(0)} editable={editable}>
        <Row label="Brand name" value={data.brandName} />
        <Row label="Primary contact" value={`${data.contactName} · ${data.contactEmail} · ${dial} ${data.contactPhone}`} />
        <Row label="Website" value={data.website && `https://${data.website}`} />
        <Row label="Industry" value={data.industry} />
        <Row label="Timezone" value={data.timezone} />
        <Row label="Location / service area" value={data.location} />
      </Section>
      <Section title="Brand direction" onEdit={() => goTo(1)} editable={editable}>
        <Row label="Description" value={data.description} />
        <Row label="Target audience" value={data.targetAudience} />
        <Row label="Products / services" value={data.productsServices} />
        <Row label="Tone & voice" value={data.tones.join(", ")} />
        <Row label="Goals" value={data.goals.join(", ")} />
        <Row label="Prohibited topics" value={data.prohibited} />
      </Section>
      <Section title="Trend context" onEdit={() => goTo(2)} editable={editable}>
        <Row label="Competitors / inspiration" value={data.competitors} />
        <Row label="Recurring topics" value={data.recurringTopics} />
        <Row label="Seasonal cycles" value={data.seasonalCycles} />
        <Row
          label="Events & promotions"
          value={
            data.events.length ? (
              <ul className="space-y-1">
                {data.events.map((e) => (
                  <li key={e.id}>
                    <strong>{e.title}</strong>
                    {e.date && <span className="text-[#74798b]"> · {new Date(e.date + "T00:00").toLocaleDateString(undefined, { dateStyle: "medium" })}</span>}
                    {e.notes && <span className="block text-[13px] text-[#5e6375]">{e.notes}</span>}
                  </li>
                ))}
              </ul>
            ) : ""
          }
        />
        <Row label="Emphasize" value={data.themesEmphasize} />
        <Row label="Avoid" value={data.themesAvoid} />
      </Section>
      <Section title="Approval preference" onEdit={() => goTo(3)} editable={editable}>
        <Row label="Mode" value={data.approvalMode === "APPROVAL_REQUIRED" ? "Approval Required" : data.approvalMode === "NO_APPROVAL" ? "No Approval Required" : ""} />
        {data.approvalMode === "APPROVAL_REQUIRED" && (
          <>
            <Row
              label="Approvers"
              value={
                <ul className="space-y-0.5">
                  {[data.primaryApprover, ...data.additionalApprovers].map((a, i) => (
                    <li key={a.id}>
                      {a.name} · {a.email}
                      {a.role && <span className="text-[#74798b]"> · {a.role}</span>}
                      {i === 0 && <span className="ml-2 rounded bg-[#E6ECFB] px-1.5 py-0.5 text-[11px] font-semibold text-[#4331d2]">Primary</span>}
                    </li>
                  ))}
                </ul>
              }
            />
            {data.additionalApprovers.length > 0 && <Row label="Rule" value={data.approvalRule === "ANYONE" ? "Anyone can approve" : "Everyone must approve"} />}
            <Row label="Chain notes" value={data.chainNotes} />
          </>
        )}
      </Section>
      <Section title="Assets" onEdit={() => goTo(4)} editable={editable}>
        <Row label="Workspace" value={data.createWorkspace ? "BPS will create a workspace for your assets" : ""} />
        <Row
          label="Files"
          value={
            data.assetFiles.length
              ? ASSET_CATEGORIES.filter((c) => data.assetFiles.some((f) => f.category === c.id))
                  .map((c) => `${c.label} (${data.assetFiles.filter((f) => f.category === c.id).length})`)
                  .join(", ")
              : ""
          }
        />
        <Row label="Notes" value={data.assetNotes} />
      </Section>
      <Section title="Social platforms" onEdit={() => goTo(5)} editable={editable}>
        <Row
          label={`Platforms (${data.platforms.length})`}
          value={
            <ul className="space-y-0.5">
              {data.platforms.map((id) => (
                <li key={id}>{platformLabel(id)}</li>
              ))}
            </ul>
          }
        />
        <Row label="Notes" value={data.socialNotes} />
      </Section>
      <Section title="MyBrandLife Gold" onEdit={() => goTo(6)} editable={editable}>
        <Row label="Preference" value={MBL_GOLD_OPTIONS.find((o) => o.id === data.mblGold)?.title ?? ""} />
      </Section>
    </div>
  );
}

function StepReview({ data, update, errors, goTo }: { data: OnboardData; update: (p: Partial<OnboardData>) => void; errors: StepErrors; goTo: (step: number) => void }) {
  return (
    <div className="space-y-5">
      <OnboardSummary data={data} goTo={goTo} />
      <label className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 ${errors.confirmed ? "border-[#E53F41] bg-[#FFF8F8]" : data.confirmed ? "border-[#4331d2] bg-[#F3F1FF]" : "border-[#E4E8F3]"}`}>
        <input type="checkbox" checked={data.confirmed} onChange={(e) => update({ confirmed: e.target.checked })} className="mt-0.5 size-4 shrink-0 accent-[#4331d2]" />
        <span className="text-[14px] leading-6 text-[#26344b]">
          I confirm this information is accurate. I understand BPS staff will use it to set up my
          workspace, social connection links, and approval workflow.
        </span>
      </label>
      {errors.confirmed && <p role="alert" className="-mt-3 text-xs text-[#E53F41]">{errors.confirmed}</p>}
    </div>
  );
}

export default StepReview;
