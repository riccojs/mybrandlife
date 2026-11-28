// DEMO support tickets (localStorage). Replace with the contact API
// (backend /contact route) when wiring the real backend.

export interface SupportTicketInput {
  name: string;
  email: string;
  topic: string;
  message: string;
  brandName?: string;
}

export interface SupportTicket extends SupportTicketInput {
  id: string;
  status: "Open" | "In progress" | "Resolved";
  createdAt: string;
}

const KEY = "bps_demo_support_tickets";

const read = (): SupportTicket[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as SupportTicket[];
  } catch {
    return [];
  }
};

export function listTickets(email: string) {
  const e = email.trim().toLowerCase();
  if (!e) return [];
  return read()
    .filter((t) => t.email.toLowerCase() === e)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function submitTicket(input: SupportTicketInput): Promise<SupportTicket> {
  await new Promise((r) => setTimeout(r, 900));
  const all = read();
  const next = 1000 + all.length + 1;
  const ticket: SupportTicket = {
    ...input,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    message: input.message.trim(),
    id: `BPS-${next}`,
    status: "Open",
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify([...all, ticket]));
  return ticket;
}
