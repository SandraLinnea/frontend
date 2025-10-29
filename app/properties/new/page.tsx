import NewProperty from "@/components/property/NewProperty";
import { PropertyProvider } from "@/context/property";
import AuthGate from "@/components/AuthGate";

export default function NewPropertyPage() {
  return (
    <>
      <h1>Skapa boende</h1>
      <AuthGate>
        <PropertyProvider>
          <NewProperty />
        </PropertyProvider>
      </AuthGate>
    </>
  );
}
