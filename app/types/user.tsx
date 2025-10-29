/* export type NewUser = {
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
}; */

export type NewUser = {
  name: string;
  email: string;
  password: string;
  is_admin?: boolean;
};

export type User = {
  id: string;
  name: string | null;
  email: string | null;
  is_admin: boolean | null;
};
