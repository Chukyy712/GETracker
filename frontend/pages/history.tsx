import EmptyState from "@/components/EmptyState";
import { ChartIcon } from "@/components/Icons";

export default function History() {
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
          Histórico de Preços
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "var(--text-secondary)",
          }}
        >
          Acompanha a evolução dos preços ao longo do tempo
        </p>
      </section>

      <EmptyState
        icon={<ChartIcon size={32} color="var(--accent)" />}
        title="Histórico em breve"
        description="Aqui poderás ver gráficos e tabelas com o histórico de preços dos itens que pesquisares."
      />
    </div>
  );
}
