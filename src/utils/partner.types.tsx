export interface PartnerType {
  title: string;
  description: string;
  linkText: string;
  link: string;
  profile: File | null;
  recipent: string[];
  type: string;
  recipentLabel: string;
  logo: string;
  create_at: string;
  id: string;
}

export interface CreatePartnerType {
  title: string;
  description: string;
  linkText: string;
  link: string;
  profile: File | null;
  recipent: string[];
  type: string;
  recipentLabel: string;
}
