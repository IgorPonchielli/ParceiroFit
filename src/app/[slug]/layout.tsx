export function generateStaticParams() {
  return [{ slug: "p" }, { slug: "igor-teste-slug" }];
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
