import { INDUSTRIES, TIMEZONES } from "../../../utils/onboard.data";
import PhoneField from "../../common/Phone.field";
import type { StepProps } from "../../../utils/onboard.types";
import { FormField, SelectInput, TextInput } from "../Onboard.ui";

function StepBusiness({ data, update, errors }: StepProps) {
  return (
    <div className="space-y-5">
      <FormField label="Brand or business name" htmlFor="brandName" required hint="Appears in your social copy" error={errors.brandName}>
        <TextInput id="brandName" value={data.brandName} invalid={!!errors.brandName} placeholder="e.g. Harbor & Vine Bistro" onChange={(e) => update({ brandName: e.target.value })} />
      </FormField>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Primary contact name" htmlFor="contactName" required error={errors.contactName}>
          <TextInput id="contactName" value={data.contactName} invalid={!!errors.contactName} autoComplete="name" onChange={(e) => update({ contactName: e.target.value })} />
        </FormField>
        <FormField label="Contact email" htmlFor="contactEmail" required error={errors.contactEmail}>
          <TextInput id="contactEmail" type="email" value={data.contactEmail} invalid={!!errors.contactEmail} autoComplete="email" onChange={(e) => update({ contactEmail: e.target.value })} />
        </FormField>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Contact phone" htmlFor="contactPhone" required error={errors.contactPhone}>
          <PhoneField
            id="contactPhone"
            variant="onboard"
            country={data.contactCountry}
            phone={data.contactPhone}
            invalid={!!errors.contactPhone}
            onChange={({ country, phone }) => update({ contactCountry: country, contactPhone: phone })}
          />
        </FormField>
        <FormField label="Company website" htmlFor="website" required error={errors.website}>
          <div className="flex">
            <span className="flex h-12 items-center rounded-l-lg border border-r-0 border-transparent bg-[#E6ECFB] px-3 text-[14px] text-[#5e6375]">https://</span>
            <TextInput id="website" className="rounded-l-none" placeholder="yourbrand.com" value={data.website} invalid={!!errors.website} onChange={(e) => update({ website: e.target.value.replace(/^https?:\/\//i, "") })} />
          </div>
        </FormField>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Industry / category" htmlFor="industry" required error={errors.industry}>
          <SelectInput id="industry" value={data.industry} invalid={!!errors.industry} onChange={(e) => update({ industry: e.target.value })}>
            <option value="">Select an industry</option>
            {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
          </SelectInput>
        </FormField>
        <FormField label="Timezone" htmlFor="timezone" required hint="Used for scheduling" error={errors.timezone}>
          <SelectInput id="timezone" value={data.timezone} invalid={!!errors.timezone} onChange={(e) => update({ timezone: e.target.value })}>
            <option value="">Select a timezone</option>
            {TIMEZONES.map((t) => <option key={t}>{t}</option>)}
          </SelectInput>
        </FormField>
      </div>

      <FormField label="Location / service area" htmlFor="location" required hint="City, region, or “Online / nationwide”" error={errors.location}>
        <TextInput id="location" value={data.location} invalid={!!errors.location} placeholder="e.g. Charleston, SC and surrounding areas" onChange={(e) => update({ location: e.target.value })} />
      </FormField>
    </div>
  );
}

export default StepBusiness;
