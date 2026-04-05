import PersonalizarClient from "./PersonalizarClient";

export function generateStaticParams() {
  return [{ slug: "p" }, { slug: "igor-teste-slug" }];
}

export default function ProfessionalPersonalizarPage() {
  return <PersonalizarClient />;
}
