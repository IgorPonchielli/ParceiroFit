export function generateStaticParams() {
  return [
    { slug: "p" }, 
    { slug: "igor-teste-slug" }, 
    { slug: "igor-personal-trainer-unique" },
    { slug: "test-loop-user-123" },
    { slug: "igorponchielli" }
  ];
}

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-950">
      {children}
    </div>
  );
}
