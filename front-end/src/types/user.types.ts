export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  school?: string | null;
  avatarUrl?: string | null;
};
