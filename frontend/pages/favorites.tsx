export default function Favorites() {
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
          Favoritos
        </h1>
        <p style={{
          fontSize: "16px",
          color: "var(--text-secondary)",
        }}>
          Os teus itens guardados para acesso rápido
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
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </div>
        <h2 style={{
          fontSize: "20px",
          fontWeight: "600",
          marginBottom: "8px",
        }}>
          Sem favoritos
        </h2>
        <p style={{
          fontSize: "14px",
          color: "var(--text-muted)",
          maxWidth: "400px",
          margin: "0 auto 24px",
        }}>
          Ainda não adicionaste nenhum item aos favoritos. Pesquisa um item e clica no ícone de estrela para o guardar.
        </p>
        <a href="/" className="btn btn-primary">
          Pesquisar Itens
        </a>
      </div>
    </div>
  );
}
