"use client";

import PropertyForm from "./PropertyFormV2";
import { useProperty } from "../../context/property";
import type { NewProperty } from "../../types/property";
//test
export default function NewPropertyView() {
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
