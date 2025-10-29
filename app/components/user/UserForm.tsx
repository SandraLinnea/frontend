"use client";

import { useMemo, useState } from "react";
import type { NewUser } from "../../types/user";

type Mode = "register" | "profile";

type Props = {
  formTitle?: string;
  initial?: Partial<NewUser>;
  onSave: (data: Partial<NewUser>) => Promise<any> | any;
  mode?: Mode;
  canEditAdmin?: boolean;
};

export default function UserForm({
  formTitle = "Add new user",
  initial,
  onSave,
  mode = "register",
  canEditAdmin = false,
}: Props) {
  const [values, setValues] = useState<Partial<NewUser>>({
    name: "",
    email: "",
    password: "",
    is_admin: false,
    ...initial,
  });
  const [loading, setLoading] = useState(false);
  const showPassword = mode === "register";

  const disabled = useMemo(
    () =>
      !values.name ||
      !values.email ||
      (showPassword && !(values.password && values.password.length >= 8)),
    [values, showPassword]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (disabled) return;
    try {
      setLoading(true);
      const payload =
        showPassword ? values : { ...values, password: undefined };
      await onSave(payload);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h2 className="text-xl font-semibold">{formTitle}</h2>

      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Namn
        </label>
        <input
          id="name"
          name="name"
          placeholder="Namn"
          autoComplete="name"
          className="mt-1 w-full rounded border px-3 py-2"
          value={values.name ?? ""}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          E-post
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="namn@exempel.se"
          autoComplete="email"
          className="mt-1 w-full rounded border px-3 py-2"
          value={values.email ?? ""}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          required
        />
      </div>

      {showPassword && (
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Lösenord (min 8 tecken)
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="••••••••"
            autoComplete="new-password"
            className="mt-1 w-full rounded border px-3 py-2"
            minLength={8}
            value={values.password ?? ""}
            onChange={(e) =>
              setValues((v) => ({ ...v, password: e.target.value }))
            }
            required
          />
        </div>
      )}

      {canEditAdmin && (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={Boolean(values.is_admin)}
            onChange={(e) =>
              setValues((v) => ({ ...v, is_admin: e.target.checked }))
            }
          />
          <span>Admin</span>
        </label>
      )}

      <button
        type="submit"
        disabled={loading || disabled}
        className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
      >
        {loading ? "Sparar…" : "Spara"}
      </button>
    </form>
  );
}
