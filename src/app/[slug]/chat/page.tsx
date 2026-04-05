import StudentChatClient from "./StudentChatClient";

export function generateStaticParams() {
  return [{ slug: "p" }, { slug: "igor-teste-slug" }];
}

export default function StudentChatPage() {
  return <StudentChatClient />;
}
