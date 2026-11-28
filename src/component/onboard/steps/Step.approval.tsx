import { Info, UserPlus, Trash2, Zap, ShieldCheck } from "lucide-react";
import { emptyApprover } from "../../../utils/onboard.data";
import type { Approver, StepProps } from "../../../utils/onboard.types";
import { Callout, ChoiceCard, FormField, SubHeading, TextArea, TextInput } from "../Onboard.ui";

const MAX_ADDITIONAL = 5;

function StepApproval({ data, update, errors }: StepProps) {
  const requiresApproval = data.approvalMode === "APPROVAL_REQUIRED";
  const totalApprovers = 1 + data.additionalApprovers.length;

  const setPrimary = (patch: Partial<Approver>) => update({ primaryApprover: { ...data.primaryApprover, ...patch } });
  const setAdditional = (id: string, patch: Partial<Approver>) =>
    update({ additionalApprovers: data.additionalApprovers.map((a) => (a.id === id ? { ...a, ...patch } : a)) });

  return (
    <div className="space-y-6">
      <div role="radiogroup" aria-label="Publishing approval preference" className="grid gap-3 lg:grid-cols-2">
        <ChoiceCard
          selected={data.approvalMode === "NO_APPROVAL"}
          onClick={() => update({ approvalMode: "NO_APPROVAL" })}
          icon={<Zap className="size-4 text-[#4331d2]" />}
          title="No Approval Required"
          badge="Hands-off"
          description="I authorize BPS to publish plan-covered content without reviewing each post first. I can still see everything on my shared calendar."
        />
        <ChoiceCard
          selected={requiresApproval}
          onClick={() => update({ approvalMode: "APPROVAL_REQUIRED" })}
          icon={<ShieldCheck className="size-4 text-[#4331d2]" />}
          title="Approval Required"
          badge="Review first"
          description="Every post waits for review. Approvers get a BPS-branded email or link to approve, reject, or comment before publishing."
        />
      </div>
      {errors.approvalMode && <p role="alert" className="-mt-3 text-xs text-[#E53F41]">{errors.approvalMode}</p>}

      {data.approvalMode === "NO_APPROVAL" && (
        <Callout icon={<Info className="size-4" />}>
          BPS may still ask you to approve a sensitive or special post. You can switch to
          Approval Required at any time from your account — our team applies the change for you.
        </Callout>
      )}

      {requiresApproval && (
        <div className="space-y-6 rounded-xl border border-[#E4E8F3] p-4 sm:p-5">
          <div className="space-y-4">
            <SubHeading title="Primary approver" description="Receives every review request." />
            <div className="grid gap-4 md:grid-cols-3">
              <FormField label="Name" htmlFor="pa-name" required error={errors["primaryApprover.name"]}>
                <TextInput id="pa-name" value={data.primaryApprover.name} invalid={!!errors["primaryApprover.name"]} onChange={(e) => setPrimary({ name: e.target.value })} />
              </FormField>
              <FormField label="Email" htmlFor="pa-email" required error={errors["primaryApprover.email"]}>
                <TextInput id="pa-email" type="email" value={data.primaryApprover.email} invalid={!!errors["primaryApprover.email"]} onChange={(e) => setPrimary({ email: e.target.value })} />
              </FormField>
              <FormField label="Role" htmlFor="pa-role" hint="Optional">
                <TextInput id="pa-role" value={data.primaryApprover.role} placeholder="e.g. Owner" onChange={(e) => setPrimary({ role: e.target.value })} />
              </FormField>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <SubHeading title="Additional approvers" description={`Optional — up to ${MAX_ADDITIONAL}.`} />
              <button
                type="button"
                disabled={data.additionalApprovers.length >= MAX_ADDITIONAL}
                onClick={() => update({ additionalApprovers: [...data.additionalApprovers, emptyApprover()] })}
                className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-[#4331d2]/30 px-3 text-[13px] font-semibold text-[#4331d2] hover:bg-[#F3F1FF] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <UserPlus className="size-4" /> Add approver
              </button>
            </div>
            {data.additionalApprovers.map((a, i) => (
              <div key={a.id} className="grid items-start gap-3 rounded-lg bg-[#F8FAFF] p-3 md:grid-cols-[1fr_1fr_1fr_auto]">
                <FormField label={`Approver ${i + 2} name`} htmlFor={`ap-name-${a.id}`} required error={errors[`approver.${a.id}.name`]}>
                  <TextInput id={`ap-name-${a.id}`} value={a.name} invalid={!!errors[`approver.${a.id}.name`]} onChange={(e) => setAdditional(a.id, { name: e.target.value })} />
                </FormField>
                <FormField label="Email" htmlFor={`ap-email-${a.id}`} required error={errors[`approver.${a.id}.email`]}>
                  <TextInput id={`ap-email-${a.id}`} type="email" value={a.email} invalid={!!errors[`approver.${a.id}.email`]} onChange={(e) => setAdditional(a.id, { email: e.target.value })} />
                </FormField>
                <FormField label="Role" htmlFor={`ap-role-${a.id}`}>
                  <TextInput id={`ap-role-${a.id}`} value={a.role} placeholder="Optional" onChange={(e) => setAdditional(a.id, { role: e.target.value })} />
                </FormField>
                <button
                  type="button"
                  aria-label={`Remove approver ${i + 2}`}
                  onClick={() => update({ additionalApprovers: data.additionalApprovers.filter((x) => x.id !== a.id) })}
                  className="cursor-pointer justify-self-end rounded-md p-2 text-[#9aa1b5] hover:bg-[#FFF1F1] hover:text-[#E53F41] md:mt-8"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>

          {totalApprovers > 1 && (
            <div className="space-y-3">
              <SubHeading title="Who needs to approve?" description={`You have ${totalApprovers} approvers.`} />
              <div role="radiogroup" className="grid gap-3 md:grid-cols-2">
                <ChoiceCard selected={data.approvalRule === "ANYONE"} onClick={() => update({ approvalRule: "ANYONE" })} title="Anyone" description="One approval from any approver is enough to publish." />
                <ChoiceCard selected={data.approvalRule === "EVERYONE"} onClick={() => update({ approvalRule: "EVERYONE" })} title="Everyone" description="Every approver must approve before the post is published." />
              </div>
            </div>
          )}

          <FormField label="Approval chain notes" htmlFor="chainNotes" hint="Optional — for multi-stage approvals">
            <TextArea id="chainNotes" className="min-h-20" value={data.chainNotes} placeholder="e.g. Marketing reviews first, then the owner signs off on anything with pricing." onChange={(e) => update({ chainNotes: e.target.value })} />
          </FormField>
        </div>
      )}
    </div>
  );
}

export default StepApproval;
