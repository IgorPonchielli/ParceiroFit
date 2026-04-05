import ProfessionalChatInboxClient from "./ChatInboxClient";

export function generateStaticParams() {
  return [{ slug: "p" }, { slug: "igor-teste-slug" }];
}

export default function ProfessionalChatInboxPage() {
  return <ProfessionalChatInboxClient />;
}
