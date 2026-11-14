import { DesignDemo } from "@/components/design/DesignDemo";
import { PageHeader } from "@/components/ui";

export const metadata = { title: "Design system" };

/** The building blocks of the interface in every state; a working reference for people building screens. */
export default function DesignPage() {
  return (
    <>
      <PageHeader title="Design system" subtitle="Buttons, text fields, money and date fields and the picker, as screens use them." />
      <DesignDemo />
    </>
  );
}
