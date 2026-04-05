import DashboardClient from "./DashboardClient";

export function generateStaticParams() {
  return [{ slug: "p" }, { slug: "igor-teste-slug" }];
}

export default function ProfessionalDashboardPage() {
  return <DashboardClient />;
}
