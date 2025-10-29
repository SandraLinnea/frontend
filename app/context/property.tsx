"use client";

import { createContext, PropsWithChildren, useContext } from "react";
import { useRouter } from "next/navigation";
import PropertyService from "@/utils/propertyUtils";
import type { NewProperty, Property } from "@/types/property";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type PropertyActions = {
  createProperty: (data: Partial<NewProperty>) => Promise<void>;
};

type PropertyState = {
  actions: PropertyActions;
};

const initialState: PropertyState = {
  actions: {
    createProperty: async () => {},
  },
};

const PropertyContext = createContext<PropertyState>(initialState);

export function PropertyProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const service = new PropertyService();

  const createProperty: PropertyActions["createProperty"] = async (data) => {
    try {
      const res = await service.createProperty(data);
      if (!res.ok) {
        // Försök läsa felmeddelande från backend
        let message = "Kunde inte skapa property";
        try {
          const j = (await res.json()) as { error?: string };
          if (j?.error) message = j.error;
        } catch {
          /* ignore JSON parse error */
        }
        throw new Error(message);
      }

      const property = (await res.json()) as Property;

      // Bygg en stabil identitet för redirect: property_code (mänsklig) eller id (uuid)
      const code = property.property_code ?? property.id ?? "";

      toast.success(`Property '${property.title}' skapades!`);
      router.push(code ? `/properties/${encodeURIComponent(code)}/edit` : "/properties");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Kunde inte skapa property";
      console.warn("Create property error:", e);
      toast.error(message);
    }
  };

  return (
    <PropertyContext.Provider value={{ actions: { createProperty } }}>
      {children}
      <ToastContainer />
    </PropertyContext.Provider>
  );
}

export function useProperty() {
  return useContext(PropertyContext);
}
