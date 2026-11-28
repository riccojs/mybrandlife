import { CalendarPlus, Trash2 } from "lucide-react";
import { uid } from "../../../utils/onboard.data";
import type { PromoEvent, StepProps } from "../../../utils/onboard.types";
import { FormField, SubHeading, TextArea, TextInput } from "../Onboard.ui";

function StepTrend({ data, update, errors }: StepProps) {
  const setEvent = (id: string, patch: Partial<PromoEvent>) =>
    update({ events: data.events.map((ev) => (ev.id === id ? { ...ev, ...patch } : ev)) });

  return (
    <div className="space-y-6">
      <FormField label="Competitors or inspiration accounts" htmlFor="competitors" hint="Optional" error={errors.competitors}>
        <TextArea id="competitors" className="min-h-20" value={data.competitors} placeholder="Handles or brands you admire, and what you like about their content." onChange={(e) => update({ competitors: e.target.value })} />
      </FormField>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Recurring topics" htmlFor="recurringTopics" required error={errors.recurringTopics}>
          <TextArea id="recurringTopics" value={data.recurringTopics} invalid={!!errors.recurringTopics} placeholder="Weekly specials, tips, team spotlights, customer stories…" onChange={(e) => update({ recurringTopics: e.target.value })} />
        </FormField>
        <FormField label="Seasonal cycles" htmlFor="seasonalCycles" required error={errors.seasonalCycles}>
          <TextArea id="seasonalCycles" value={data.seasonalCycles} invalid={!!errors.seasonalCycles} placeholder="Busy seasons, holidays, launches, or yearly moments that matter." onChange={(e) => update({ seasonalCycles: e.target.value })} />
        </FormField>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SubHeading title="Upcoming events & promotions" description="Optional. You can also send these later as content requests." />
          <button
            type="button"
            onClick={() => update({ events: [...data.events, { id: uid(), title: "", date: "", notes: "" }] })}
            className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-[#4331d2]/30 px-3 text-[13px] font-semibold text-[#4331d2] hover:bg-[#F3F1FF]"
          >
            <CalendarPlus className="size-4" /> Add event
          </button>
        </div>
        {data.events.length === 0 && (
          <p className="rounded-lg border border-dashed border-[#d5dbec] p-4 text-center text-[13px] text-[#74798b]">
            No events added yet.
          </p>
        )}
        {data.events.map((ev, i) => (
          <div key={ev.id} className="rounded-xl border border-[#E4E8F3] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-[#74798b]">Event {i + 1}</span>
              <button type="button" aria-label={`Remove event ${i + 1}`} onClick={() => update({ events: data.events.filter((x) => x.id !== ev.id) })} className="cursor-pointer rounded-md p-1.5 text-[#9aa1b5] hover:bg-[#FFF1F1] hover:text-[#E53F41]">
                <Trash2 className="size-4" />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
              <FormField label="Title" htmlFor={`ev-title-${ev.id}`} required error={errors[`events.${ev.id}.title`]}>
                <TextInput id={`ev-title-${ev.id}`} value={ev.title} invalid={!!errors[`events.${ev.id}.title`]} placeholder="e.g. Spring menu launch" onChange={(e) => setEvent(ev.id, { title: e.target.value })} />
              </FormField>
              <FormField label="Date" htmlFor={`ev-date-${ev.id}`}>
                <TextInput id={`ev-date-${ev.id}`} type="date" value={ev.date} onChange={(e) => setEvent(ev.id, { date: e.target.value })} />
              </FormField>
            </div>
            <div className="mt-3">
              <FormField label="Details" htmlFor={`ev-notes-${ev.id}`}>
                <TextInput id={`ev-notes-${ev.id}`} value={ev.notes} placeholder="Offer, price, link, or anything we should mention" onChange={(e) => setEvent(ev.id, { notes: e.target.value })} />
              </FormField>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Themes to emphasize" htmlFor="themesEmphasize" hint="Optional">
          <TextArea id="themesEmphasize" className="min-h-20" value={data.themesEmphasize} placeholder="Values, messages, or stories to highlight." onChange={(e) => update({ themesEmphasize: e.target.value })} />
        </FormField>
        <FormField label="Themes to avoid" htmlFor="themesAvoid" hint="Optional">
          <TextArea id="themesAvoid" className="min-h-20" value={data.themesAvoid} placeholder="Styles, trends, or subjects that don't fit your brand." onChange={(e) => update({ themesAvoid: e.target.value })} />
        </FormField>
      </div>
    </div>
  );
}

export default StepTrend;
