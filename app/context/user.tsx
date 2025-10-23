"use client";

import { createContext, PropsWithChildren, useContext } from "react";
import { useRouter } from "next/navigation";
import UserService from "@/utils/userService";
import type { NewUser, User } from "@/types/user";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type UserState = {
  actions: {
    createUser: (data: Partial<NewUser>) => Promise<void>;
  };
};

const initialState: UserState = {
  actions: { createUser: async () => {} },
};

const UserContext = createContext<UserState>(initialState);

export function UserProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const service = new UserService();

  const createUser: UserState["actions"]["createUser"] = async (data) => {
    try {
      const res = await service.createUser(data);
      if (!res.ok) {
        const msg = (await res.json().catch(() => null))?.error ?? "Could not create account";
        throw new Error(msg);
      }
      const usser: User = await res.json();
      const code = user.user_id ?? user.user_id ?? user.id;

      toast.success(`User '${user.name}' skapades!`);
      router.push(code ? `/users/${encodeURIComponent(code)}/edit` : `/users`);
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
