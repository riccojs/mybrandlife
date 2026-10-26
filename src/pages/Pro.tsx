import { useState } from "react";
import {
  AtSign,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Save,
  ShieldCheck,
  UserRound,
  UserRoundPen,
  Cloud,
} from "lucide-react";

type Profile = {
  email: string;
  phone: string;
  role: string;
  address: string;
  username: string;
  secretKey: string;
  firstName: string;
  lastName: string;
  active: boolean;
};

const initialProfile: Profile = {
  email: "Riccojs@Yahoo.Com",
  phone: "+1715574-6890",
  role: "",
  address: "United State",
  username: "ricco",
  secretKey: "K8mP2xR9vL",
  firstName: "Jhon",
  lastName: "Troemel",
  active: true,
};

const joiningDate = "26 May 2026";

type FieldProps = {
  label: string;
  icon: React.ElementType;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  optional?: boolean;
  verified?: boolean;
  encrypted?: boolean;
  secret?: boolean;
};

function AccountField({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  optional,
  verified,
  encrypted,
  secret,
}: FieldProps) {
  const [showSecret, setShowSecret] = useState(false);

  return (
    <div className="min-w-0">
      <div className="mb-1.5 flex min-h-4 items-center justify-between gap-2">
        <label className="text-[11px] font-semibold text-slate-700">
          {label}
        </label>

        {verified && (
          <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
            <CheckCircle2
              size={11}
              fill="currentColor"
              className="text-emerald-600 [&>path]:stroke-white"
            />
            Verified
          </span>
        )}

        {optional && (
          <span className="text-[10px] text-slate-400">Optional</span>
        )}

        {encrypted && (
          <span className="text-[10px] font-medium text-emerald-600">
            Encrypted
          </span>
        )}
      </div>

      <div className="flex h-9.75 items-center gap-3 rounded-xl border border-[#dce5f2] bg-white px-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10">
        <Icon size={14} className="shrink-0 text-[#8ba0c0]" />

        <input
          aria-label={label}
          type={secret && !showSecret ? "password" : "text"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-full w-full min-w-0 bg-transparent text-[12px] text-slate-900 outline-none placeholder:text-[#8ba0c0]"
        />

        {secret && (
          <button
            type="button"
            onClick={() => setShowSecret((previous) => !previous)}
            aria-label={showSecret ? "Hide secret key" : "Show secret key"}
            className="shrink-0 text-[#8ba0c0] transition hover:text-slate-700"
          >
            {showSecret ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function AccountProfile() {
  const [profile, setProfile] = useState<Profile>({ ...initialProfile });
  const [saved, setSaved] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("Today at 2:53 PM");

  const updateField = (field: keyof Profile, value: string | boolean) => {
    setProfile((previous) => ({ ...previous, [field]: value }));
    setSaved(false);
  };

  const resetForm = () => {
    setProfile({ ...initialProfile });
    setSaved(false);
  };

  const saveRecord = () => {
    // Connect your API request here to persist the profile.
    setLastUpdated(
      `Today at ${new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })}`,
    );
    setSaved(true);
  };

  const fields: {
    label: string;
    icon: React.ElementType;
    key: keyof Profile;
    placeholder?: string;
    optional?: boolean;
    verified?: boolean;
    encrypted?: boolean;
    secret?: boolean;
  }[] = [
    { label: "Email", icon: Mail, key: "email", verified: true },
    { label: "Phone", icon: Phone, key: "phone" },
    {
      label: "Role",
      icon: Building2,
      key: "role",
      placeholder: "Assign role or executive title...",
      optional: true,
    },
    { label: "Address", icon: MapPin, key: "address" },
    { label: "Username", icon: UserRoundPen, key: "username" },
    {
      label: "Secret Key",
      icon: KeyRound,
      key: "secretKey",
      encrypted: true,
      secret: true,
    },
    { label: "First Name", icon: UserRound, key: "firstName" },
    { label: "Last Name", icon: UserRound, key: "lastName" },
  ];

  return (
    <main className="min-h-screen bg-[#f6f9fc] font-sans text-slate-900">
      <div className="mx-auto w-full space-y-7">
        {/* Profile header */}
        <section className="overflow-hidden rounded-2xl border border-[#e0e8f2] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="relative h-39.25 overflow-hidden bg-linear-to-r from-[#08251e] via-[#064333] to-[#087354]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_82%_20%,rgba(17,185,129,0.19),transparent_40%),radial-gradient(ellipse_at_40%_100%,rgba(4,120,87,0.12),transparent_45%)]" />

            <div className="absolute left-7 top-4.5 rounded-full border border-white/15 bg-white/15 px-7 py-1.5 text-[10px] font-medium tracking-wide text-emerald-100">
              Live Studio Identity
            </div>

            <div className="absolute right-7 top-4.5 flex items-center gap-2 rounded-full border border-white/15 bg-[#052e25]/75 px-5 py-1.5 text-[10px] text-emerald-100">
              <Cloud size={12} />
              Cloud Sync: Active
            </div>
          </div>

          <div className="relative flex min-h-16.25 flex-col justify-end px-6 pb-5 pl-36.25 sm:min-h-16.25 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:pb-5 sm:pr-7">
            {/* Avatar */}
            <div className="absolute -top-15 left-6 flex size-27.25 items-center justify-center rounded-full border-4 border-white bg-[#080808] shadow-[0_8px_20px_rgba(0,0,0,0.12)]">
              <div className="flex size-21.75 items-center justify-center rounded-full border border-white/15 bg-linear-to-b from-[#191919] to-black">
                <svg
                  viewBox="0 0 64 64"
                  className="size-15.25 text-white"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <circle cx="32" cy="16" r="8" />
                  <path d="M10 48c3-12 12-19 22-19s19 7 22 19l-8 0c-4-7-8-10-14-10s-10 3-14 10z" />
                  <path d="M12 49c3-8 11-13 20-13s17 5 20 13l-6 6H18z" />
                </svg>
              </div>

              <span className="absolute -bottom-0.5 -right-0.5 flex size-7 items-center justify-center rounded-full border-[3px] border-white bg-emerald-600 text-white">
                <Check size={13} strokeWidth={3} />
              </span>
            </div>

            <div className="min-w-0 pb-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[20px] font-bold tracking-[-0.5px] text-[#101828]">
                  {profile.firstName} {profile.lastName}
                </h1>
                <span
                  className={`rounded-md px-2.5 py-1 text-[9px] font-bold tracking-[0.5px] ${
                    profile.active
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {profile.active ? "ACTIVATE" : "INACTIVE"}
                </span>
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#607494]">
                <span className="flex items-center gap-1">
                  <AtSign size={12} />
                  {profile.username}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {profile.address || "No address"}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1">
                  <CalendarDays size={12} />
                  Joined {joiningDate}
                </span>
              </div>
            </div>

            <div className="mt-4 flex shrink-0 items-center gap-3 rounded-xl border border-[#e2e9f2] bg-[#f8fafc] px-3.5 py-2.5 sm:mt-0 sm:mb-0">
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <ShieldCheck size={16} />
              </div>
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.6px] text-[#8ba0bd]">
                  Account Active Since
                </p>
                <p className="text-[11px] font-semibold text-slate-800">
                  {joiningDate}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Account information */}
        <section className="overflow-hidden rounded-2xl border border-[#e0e8f2] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf1f7] px-5 py-5 sm:px-7">
            <div>
              <h2 className="text-[13px] font-bold text-[#182338]">
                Account Information
              </h2>
              <p className="mt-0.5 text-[11px] text-[#7185a4]">
                All registered credentials and profile properties from datastore
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50/70 px-2.5 py-1 text-[10px] font-medium text-emerald-600">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Sync Active
            </span>
          </div>

          <div className="px-5 pb-7 pt-6 sm:px-7">
            <div className="grid grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-2">
              {fields.map((field) => (
                <AccountField
                  key={field.key}
                  label={field.label}
                  icon={field.icon}
                  value={String(profile[field.key])}
                  onChange={(value) => updateField(field.key, value)}
                  placeholder={field.placeholder}
                  optional={field.optional}
                  verified={field.verified}
                  encrypted={field.encrypted}
                  secret={field.secret}
                />
              ))}
            </div>

            <div className="mt-5 border-t border-[#edf1f7] pt-5">
              {/* Profile status */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#dce6f3] bg-[#fbfcfe] px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100/80 text-emerald-700">
                    <CheckCircle2 size={15} />
                  </div>
                  <div>
                    <p className="text-[12px] font-medium text-[#253249]">
                      Profile Status:
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#7185a4]">
                      Operational across all studio features
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => updateField("active", !profile.active)}
                  className={`rounded-lg px-3.5 py-2 text-[10px] font-bold tracking-wide transition hover:opacity-80 ${
                    profile.active
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {profile.active ? "DEACTIVATE" : "ACTIVATE"}
                </button>
              </div>

              {/* Joining date */}
              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#dce6f3] bg-[#fbfcfe] px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <CalendarDays size={15} />
                  </div>
                  <div>
                    <p className="text-[12px] font-medium text-[#253249]">
                      Joining Date:
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#7185a4]">
                      Registration established and verified
                    </p>
                  </div>
                </div>
                <span className="text-[12px] font-semibold text-[#253249]">
                  {joiningDate}
                </span>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex flex-col gap-3 border-t border-[#edf1f7] bg-[#fbfcfe] px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="flex items-center gap-2 text-[10px] text-[#7185a4]">
              <span
                className={`size-1.5 rounded-full ${
                  saved ? "bg-emerald-500" : "bg-[#34c795]"
                }`}
              />
              {saved
                ? "Changes saved successfully"
                : `Last updated: ${lastUpdated}`}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-[10px] font-semibold text-[#526581] transition hover:bg-slate-100"
              >
                <RotateCcw size={12} />
                Reset to default
              </button>

              <button
                type="button"
                onClick={saveRecord}
                className="inline-flex min-w-25.25 items-center justify-center gap-2 rounded-xl bg-[#101729] px-4 py-2.5 text-[10px] font-semibold text-white shadow-sm transition hover:bg-[#202c44] active:scale-[0.98]"
              >
                {saved ? <Check size={13} /> : <Save size={13} />}
                {saved ? "Saved" : "Save Record"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
