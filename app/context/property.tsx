"use client";

import { createContext, PropsWithChildren, useContext } from "react";
import { useRouter } from "next/navigation";
import PropertyService from "@/utils/propertyService";
import type { NewProperty, Property } from "@/types/property";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type PropertyState = {
  actions: {
    createProperty: (data: Partial<NewProperty>) => Promise<void>;
  };
};

const initialState: PropertyState = {
  actions: { createProperty: async () => {} },
};

const PropertyContext = createContext<PropertyState>(initialState);

export function PropertyProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const service = new PropertyService();

  const createProperty: PropertyState["actions"]["createProperty"] = async (data) => {
    try {
      const res = await service.createProperty(data);
      if (!res.ok) {
        const msg = (await res.json().catch(() => null))?.error ?? "Kunde inte skapa property";
        throw new Error(msg);
      }
      const property: Property = await res.json();
      const code = property.property_code ?? property.property_id ?? property.id;

      toast.success(`Property '${property.title}' skapades!`);
      router.push(code ? `/properties/${encodeURIComponent(code)}/edit` : `/properties`);
    } catch (err: any) {
      console.warn("Create property error:", err);
      toast.error(err?.message ?? "Kunde inte skapa property");
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
