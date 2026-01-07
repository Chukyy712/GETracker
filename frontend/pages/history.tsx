export default function History() {
  return (
    <div>
      {/* Page Header */}
      <section style={{
        marginBottom: "32px",
      }}>
        <h1 style={{
          fontSize: "28px",
          fontWeight: "700",
          marginBottom: "8px",
        }}>
          Histórico de Preços
        </h1>
        <p style={{
          fontSize: "16px",
          color: "var(--text-secondary)",
        }}>
          Acompanha a evolução dos preços ao longo do tempo
        </p>
      </section>

      {/* Empty State */}
      <div style={{
        background: "var(--bg-secondary)",
        borderRadius: "var(--radius-lg)",
        padding: "64px 32px",
        textAlign: "center",
      }}>
        <div style={{
          width: "64px",
          height: "64px",
          background: "var(--accent-dim)",
          borderRadius: "var(--radius-lg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px",
        }}>
          <svg width="32" height="32" fill="var(--accent)" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
        </div>
        <h2 style={{
          fontSize: "20px",
          fontWeight: "600",
          marginBottom: "8px",
        }}>
          Histórico em breve
        </h2>
        <p style={{
          fontSize: "14px",
          color: "var(--text-muted)",
          maxWidth: "400px",
          margin: "0 auto",
        }}>
          Aqui poderás ver gráficos e tabelas com o histórico de preços dos itens que pesquisares.
        </p>
      </div>
    </div>
  );
}
