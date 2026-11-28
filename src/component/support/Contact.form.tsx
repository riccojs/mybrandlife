import { useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { CheckCircle2, Inbox, Info, Loader2, Send } from "lucide-react";
import { useAuth } from "../../redux/hooks";
import { listTickets, submitTicket, type SupportTicket } from "../../services/demo.support.service";
import { isEmail } from "../../utils/validation";

const SUPPORT_TOPICS = [
  "Getting started",
  "Onboarding & setup",
  "Connecting social accounts",
  "Approvals & content calendar",
  "Content requests",
  "Reports",
  "Plan & billing",
  "Something else",
];

const MAX_MESSAGE = 1000;
const MIN_MESSAGE = 20;

type Form = { name: string; email: string; topic: string; message: string };
type Errors = Partial<Record<keyof Form, string>>;

const field =
  "w-full rounded-xl border bg-white px-3.5 text-[14px] outline-none transition focus:ring-2";
const ok = "border-[#d7d7d7] focus:border-[#2A65E9] focus:ring-[#2A65E9]/10";
const bad = "border-[#E53F41] focus:border-[#E53F41] focus:ring-[#E53F41]/10";

const DEMO: Omit<Form, "name" | "email"> = {
  topic: "Approvals & content calendar",
  message:
    "Hi team — we'd like to add our general manager as a second approver and switch to “Everyone must approve” for posts that mention pricing. Can you update our approval workflow?",
};

function ContactForm() {
  const { user } = useAuth();
  const initial: Form = {
    name: user ? `${user.firstName} ${user.lastName}`.trim() : "",
    email: user?.email ?? "",
    topic: "",
    message: "",
  };
  const [form, setForm] = useState<Form>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<SupportTicket | null>(null);
  const [history, setHistory] = useState<SupportTicket[]>(() => listTickets(initial.email));

  const set = (patch: Partial<Form>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => {
      const next = { ...prev };
      (Object.keys(patch) as (keyof Form)[]).forEach((k) => delete next[k]);
      return next;
    });
  };

  const validate = (f: Form): Errors => {
    const e: Errors = {};
    if (f.name.trim().length < 2) e.name = "Enter your name.";
    if (!isEmail(f.email)) e.email = "Enter a valid email address.";
    if (!f.topic) e.topic = "Choose a topic.";
    if (f.message.trim().length < MIN_MESSAGE) e.message = `Tell us a little more (at least ${MIN_MESSAGE} characters).`;
    return e;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = validate(form);
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setSending(true);
    const ticket = await submitTicket(form);
    setSending(false);
    setSent(ticket);
    setHistory(listTickets(ticket.email));
    toast.success(`Message sent · ${ticket.id}`);
  };

  const reset = () => {
    setSent(null);
    setForm({ ...initial, name: form.name, email: form.email });
    setErrors({});
  };

  return (
    <div className="h-fit space-y-6">
      <div className="rounded-[22px] bg-white px-5 py-7 shadow-[0_15px_50px_rgba(0,0,0,0.08)] sm:px-8">
        {sent ? (
          <div role="status" className="text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#E8F7F3] text-[#177a6d]">
              <CheckCircle2 className="size-8" />
            </span>
            <h2 className="mt-4 text-xl font-semibold text-[#161B2B]">Message sent</h2>
            <p className="mt-2 text-sm leading-6 text-[#161B2B]/65">
              Thanks, {sent.name.split(" ")[0]}. We'll reply to <strong className="text-[#161B2B]">{sent.email}</strong>.
            </p>
            <dl className="mt-5 space-y-2 rounded-xl bg-[#F8FAFF] p-4 text-left text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-[#161B2B]/55">Reference</dt>
                <dd className="font-semibold text-[#161B2B]">{sent.id}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#161B2B]/55">Topic</dt>
                <dd className="text-right text-[#161B2B]">{sent.topic}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#161B2B]/55">Status</dt>
                <dd className="font-semibold text-[#2A65E9]">{sent.status}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={reset}
              className="mt-6 h-11 w-full cursor-pointer rounded-full border border-[#161B2B]/10 text-sm font-semibold text-[#161B2B] hover:bg-[#F5F7FE]"
            >
              Send another message
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-[#161B2B]">Contact our team</h2>
            <p className="mt-1 text-sm text-[#161B2B]/60">
              {user ? "We've filled in your account details." : (
                <>
                  Already a customer?{" "}
                  <Link to="/auth/sign-in" className="font-medium text-[#2A65E9] underline underline-offset-2">Sign in</Link>{" "}
                  so we can find your account faster.
                </>
              )}
            </p>

            <div className="mt-4 flex gap-2.5 rounded-xl border border-[#2A65E9]/20 bg-[#EAF1FF] p-3 text-xs leading-5 text-[#3F4654]">
              <Info className="mt-0.5 size-4 shrink-0 text-[#2A65E9]" />
              <p>
                <strong>Demo mode:</strong> messages are saved in this browser, not emailed.{" "}
                <button
                  type="button"
                  onClick={() =>
                    set({
                      name: form.name || "Jordan Rivera",
                      email: form.email || "jordan@harborandvine.com",
                      ...DEMO,
                    })
                  }
                  className="cursor-pointer font-semibold text-[#2A65E9] underline underline-offset-2"
                >
                  Fill demo message
                </button>
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1 block text-[13px] font-medium text-[#252525]">Name</label>
                  <input id="name" autoComplete="name" value={form.name} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} onChange={(e) => set({ name: e.target.value })} className={`${field} h-11 ${errors.name ? bad : ok}`} />
                  {errors.name && <p id="name-error" className="mt-1 text-xs text-[#E53F41]">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="mb-1 block text-[13px] font-medium text-[#252525]">Email</label>
                  <input id="email" type="email" autoComplete="email" value={form.email} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} onChange={(e) => set({ email: e.target.value })} className={`${field} h-11 ${errors.email ? bad : ok}`} />
                  {errors.email && <p id="email-error" className="mt-1 text-xs text-[#E53F41]">{errors.email}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="topic" className="mb-1 block text-[13px] font-medium text-[#252525]">Topic</label>
                <select id="topic" value={form.topic} aria-invalid={!!errors.topic} aria-describedby={errors.topic ? "topic-error" : undefined} onChange={(e) => set({ topic: e.target.value })} className={`${field} h-11 ${errors.topic ? bad : ok}`}>
                  <option value="">Choose a topic</option>
                  {SUPPORT_TOPICS.map((t) => <option key={t}>{t}</option>)}
                </select>
                {errors.topic && <p id="topic-error" className="mt-1 text-xs text-[#E53F41]">{errors.topic}</p>}
              </div>
              <div>
                <div className="mb-1 flex items-baseline justify-between">
                  <label htmlFor="message" className="block text-[13px] font-medium text-[#252525]">Message</label>
                  <span className="text-[11px] text-[#161B2B]/45">{form.message.length} / {MAX_MESSAGE}</span>
                </div>
                <textarea id="message" rows={5} maxLength={MAX_MESSAGE} value={form.message} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} placeholder="How can we help?" onChange={(e) => set({ message: e.target.value })} className={`${field} resize-y py-3 leading-6 ${errors.message ? bad : ok}`} />
                {errors.message && <p id="message-error" className="mt-1 text-xs text-[#E53F41]">{errors.message}</p>}
              </div>
              <button
                type="submit"
                disabled={sending}
                className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#2A65E9] text-sm font-semibold text-white shadow-sm transition hover:bg-[#2058D0] disabled:cursor-wait disabled:opacity-75"
              >
                {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                {sending ? "Sending…" : "Send message"}
              </button>
            </form>
          </>
        )}
      </div>

      {history.length > 0 && (
        <div className="rounded-2xl border border-[#161B2B]/8 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-[#161B2B]">
            <Inbox className="size-4 text-[#2A65E9]" /> Your recent requests
          </h3>
          <ul className="mt-3 divide-y divide-[#161B2B]/6">
            {history.slice(0, 5).map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-[#161B2B]">{t.topic}</p>
                  <p className="text-xs text-[#161B2B]/50">
                    {t.id} · {new Date(t.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-[#EAF1FF] px-2.5 py-1 text-[11px] font-semibold text-[#2A65E9]">{t.status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ContactForm;
