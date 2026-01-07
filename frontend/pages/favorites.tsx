import EmptyState from "@/components/EmptyState";
import { StarIcon } from "@/components/Icons";

export default function Favorites() {
  return (
    <div>
      {/* Page Header */}
      <section style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "700",
            marginBottom: "8px",
          }}
        >
          Favoritos
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "var(--text-secondary)",
          }}
        >
          Os teus itens guardados para acesso rápido
        </p>
      </section>

      <EmptyState
        icon={<StarIcon size={32} color="var(--accent)" />}
        title="Sem favoritos"
        description="Ainda não adicionaste nenhum item aos favoritos. Pesquisa um item e clica no ícone de estrela para o guardar."
        action={{ label: "Pesquisar Itens", href: "/" }}
      />
    </div>
  );
}
