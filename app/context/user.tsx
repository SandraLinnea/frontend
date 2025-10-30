"use client";

import { createContext, PropsWithChildren, useContext } from "react";
import { useRouter } from "next/navigation";
import { createUser as createUserApi } from "../utils/userUtils";
import type { NewUser, User } from "../types/user";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type UserState = {
  actions: { createUser: (data: Partial<NewUser>) => Promise<void> };
};

const initialState: UserState = { actions: { createUser: async () => {} } };

const UserContext = createContext<UserState>(initialState);

export function UserProvider({ children }: PropsWithChildren) {
  const router = useRouter();

  const createUser: UserState["actions"]["createUser"] = async (data) => {
    try {
      const user: User = await createUserApi(data);
      const code = (user as any).user_id ?? (user as any).id;

      toast.success(`User '${user.name}' skapades!`);
      router.push(code ? `/users/${encodeURIComponent(String(code))}/edit` : `/users`);
    } catch (err: any) {
      console.warn("Create account error:", err);
      toast.error(err?.message ?? "Could not create account");
    }
  };

  return (
    <UserContext.Provider value={{ actions: { createUser } }}>
      {children}
      <ToastContainer />
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
