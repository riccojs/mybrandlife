export interface NotificationType {
  id: string;
  title: string;
  redirectUrl: string;
  type: "ROUTE" | "MODAL";
  profile: string | null;
  seen: boolean;
  userId: string;
  update_at: string;
  create_at: string;
}
