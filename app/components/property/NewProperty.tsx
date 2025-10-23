"use client";

import PropertyForm from "@/components/property/PropertyForm";
import { useProperty } from "@/context/property";
import type { NewProperty } from "@/types/property";

export default function NewProperty() {
  const property = useProperty();
  const onCreate = async (data: Partial<NewProperty>) => {
    await property.actions.createProperty(data);
  };
  return (
    <div>
      <PropertyForm formTitle="Add new property" onSave={onCreate} />
    </div>
  );
}
