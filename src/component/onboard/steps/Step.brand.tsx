import { ShieldAlert } from "lucide-react";
import { GOALS, MAX_TONES, TONES } from "../../../utils/onboard.data";
import type { StepProps } from "../../../utils/onboard.types";
import { Chip, FormField, TextArea } from "../Onboard.ui";

const Counter = ({ value, max }: { value: string; max: number }) => (
  <span className={value.length > max * 0.9 ? "text-[#C77700]" : ""}>
    {value.length} / {max}
  </span>
);

function StepBrand({ data, update, errors }: StepProps) {
  const toggle = (list: string[], item: string, max?: number) =>
    list.includes(item) ? list.filter((x) => x !== item) : max && list.length >= max ? list : [...list, item];

  return (
    <div className="space-y-6">
      <FormField label="What does your business do?" htmlFor="description" required hint={<Counter value={data.description} max={600} />} error={errors.description}>
        <TextArea id="description" maxLength={600} value={data.description} invalid={!!errors.description} placeholder="Describe your business, what makes it different, and its story." onChange={(e) => update({ description: e.target.value })} />
      </FormField>

      <FormField label="Who is your target audience?" htmlFor="targetAudience" required hint={<Counter value={data.targetAudience} max={500} />} error={errors.targetAudience}>
        <TextArea id="targetAudience" maxLength={500} value={data.targetAudience} invalid={!!errors.targetAudience} placeholder="Who buys from you? Age, location, interests, the problems you solve for them." onChange={(e) => update({ targetAudience: e.target.value })} />
      </FormField>

      <FormField label="Main products or services" htmlFor="productsServices" required hint="Separate with commas" error={errors.productsServices}>
        <TextArea id="productsServices" className="min-h-20" value={data.productsServices} invalid={!!errors.productsServices} placeholder="e.g. Dinner service, weekend brunch, private events, catering" onChange={(e) => update({ productsServices: e.target.value })} />
      </FormField>

      <FormField label="Tone & voice" required hint={`${data.tones.length} of up to ${MAX_TONES} selected`} error={errors.tones}>
        <div className="flex flex-wrap gap-2">
          {TONES.map((tone) => {
            const selected = data.tones.includes(tone);
            return (
              <Chip key={tone} selected={selected} disabled={!selected && data.tones.length >= MAX_TONES} onClick={() => update({ tones: toggle(data.tones, tone, MAX_TONES) })}>
                {tone}
              </Chip>
            );
          })}
        </div>
      </FormField>

      <FormField label="Social media goals" required hint="Pick all that apply" error={errors.goals}>
        <div className="grid gap-2 sm:grid-cols-2">
          {GOALS.map((goal) => {
            const checked = data.goals.includes(goal);
            return (
              <label key={goal} className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm font-medium transition ${checked ? "border-[#4331d2] bg-[#F3F1FF] text-[#26214f]" : "border-transparent bg-[#F5F7FE] text-[#26344b] hover:bg-[#EDF1FC]"}`}>
                <input type="checkbox" checked={checked} onChange={() => update({ goals: toggle(data.goals, goal) })} className="size-4 shrink-0 accent-[#4331d2]" />
                {goal}
              </label>
            );
          })}
        </div>
      </FormField>

      <div className="rounded-xl bg-[#FFF8F3] p-4 sm:p-5">
        <FormField label="Prohibited topics & claims" htmlFor="prohibited" required hint="Write “None” if nothing applies" error={errors.prohibited}>
          <p className="-mt-0.5 mb-2 flex gap-1.5 text-[13px] text-[#7A4E00]">
            <ShieldAlert className="mt-0.5 size-4 shrink-0" />
            Topics, claims, wording, or compliance rules we must never publish.
          </p>
          <TextArea id="prohibited" className="bg-white" value={data.prohibited} invalid={!!errors.prohibited} placeholder="e.g. No pricing guarantees, no medical claims, avoid politics." onChange={(e) => update({ prohibited: e.target.value })} />
        </FormField>
      </div>
    </div>
  );
}

export default StepBrand;
