import EditarConteudoClient from "./EditarConteudoClient";

// Retorna uma matriz vazia para contornar a obrigatoriedade do
// generateStaticParams em builds 'output: export' para rotas dinâmicas
export function generateStaticParams() {
  return [];
}

// A página injeta o contentId capturado nos parâmetros da URL para o Client Component
export default function EditarConteudoPage({ params }: { params: { slug: string; id: string } }) {
  return <EditarConteudoClient contentId={params.id} />;
}
