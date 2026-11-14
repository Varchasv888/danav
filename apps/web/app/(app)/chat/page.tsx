import { MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Chat, type Person } from "@/components/chat/Chat";
import { PageHeader } from "@/components/ui";
import { serverApi } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("chat"))("title") };
}

/** Direct messages with the other people in this business. */
export default async function ChatPage() {
  const t = await getTranslations("chat");
  const people = await serverApi<Person[]>("/chat/people");
  return (
    <>
      <PageHeader icon={MessageCircle} title={t("title")} subtitle={t("subtitle")} />
      <Chat people={people} />
    </>
  );
}
