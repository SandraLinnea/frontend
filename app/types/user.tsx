export type NewUser = {
  user_id?: string;
  name: string;
  email: string;
  password: string;
  is_admin?: boolean;
};

export type User = NewUser & {
  user_id: string;
  password_hash: string;
  created_at: string;
};