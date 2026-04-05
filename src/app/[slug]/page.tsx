import StudentViewClient from "./StudentViewClient";

export function generateStaticParams() {
  return [{ slug: "p" }, { slug: "igor-teste-slug" }];
}

export default function StudentPage() {
  return <StudentViewClient />;
}
