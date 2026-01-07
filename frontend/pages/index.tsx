import { useState } from "react";
import SearchAutocomplete from "@/components/SearchAutocomplete";

export default function Home() {
  const [item, setItem] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastSearchedItem, setLastSearchedItem] = useState("");

  const fetchPrice = async (searchItem?: string) => {
    const itemToSearch = searchItem || item;
    setError("");
    setIsLoading(true);

    if (!itemToSearch) {
      setError("Escreve o nome de um item!");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/price/${encodeURIComponent(itemToSearch)}`);

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro desconhecido");
        setPrice(null);
        return;
      }

      const data = await res.json();
      setPrice(data.price);
      setLastSearchedItem(itemToSearch);
    } catch (err) {
      setError("Não foi possível conectar ao servidor.");
      setPrice(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        textAlign: "center",
        padding: "48px 0 64px",
      }}>
        <h1 style={{
          fontSize: "42px",
          fontWeight: "700",
          marginBottom: "16px",
          background: "linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          GE Finance
        </h1>
        <p style={{
          fontSize: "18px",
          color: "var(--text-secondary)",
          maxWidth: "500px",
          margin: "0 auto 32px",
        }}>
          Acompanha os preços do Grand Exchange em tempo real
        </p>
        <button
          onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="btn btn-primary"
          style={{
            fontSize: "16px",
            padding: "14px 28px",
          }}
        >
          Pesquisar Itens
        </button>
      </section>

      {/* Search Section */}
      <section id="search-section" style={{
        background: "var(--bg-secondary)",
        borderRadius: "var(--radius-lg)",
        padding: "32px",
        marginBottom: "48px",
      }}>
        <h2 style={{
          fontSize: "20px",
          fontWeight: "600",
          marginBottom: "20px",
        }}>
          Buscar Preço
        </h2>

        <div style={{
          display: "flex",
          gap: "12px",
          marginBottom: "24px",
        }}>
          <SearchAutocomplete
            value={item}
            onChange={setItem}
            onSelect={(selectedItem) => {
              setItem(selectedItem.name);
              fetchPrice(selectedItem.name);
            }}
            placeholder="Nome do item (ex: Dragon scimitar)"
            disabled={isLoading}
          />
          <button
            onClick={() => fetchPrice()}
            disabled={isLoading}
            className="btn btn-primary"
            style={{
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? 'wait' : 'pointer',
              minWidth: "140px",
            }}
          >
            {isLoading ? 'A buscar...' : 'Buscar'}
          </button>
        </div>

        {/* Result Card */}
        {price !== null && (
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            padding: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div>
              <p style={{
                fontSize: "14px",
                color: "var(--text-muted)",
                marginBottom: "4px",
              }}>
                Item
              </p>
              <p style={{
                fontSize: "18px",
                fontWeight: "600",
              }}>
                {lastSearchedItem}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{
                fontSize: "14px",
                color: "var(--text-muted)",
                marginBottom: "4px",
              }}>
                Preço
              </p>
              <p style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "var(--accent)",
              }}>
                {price.toLocaleString()} gp
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "var(--radius-md)",
            padding: "16px",
            color: "#ef4444",
          }}>
            {error}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section>
        <h2 className="section-title">Funcionalidades</h2>
        <div className="grid grid-3">
          <div className="card">
            <div style={{
              width: "40px",
              height: "40px",
              background: "var(--accent-dim)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
            }}>
              <svg width="20" height="20" fill="var(--accent)" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 style={{
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "8px",
            }}>
              Preços em Tempo Real
            </h3>
            <p style={{
              fontSize: "14px",
              color: "var(--text-secondary)",
            }}>
              Dados atualizados diretamente da OSRS Wiki API
            </p>
          </div>

          <div className="card">
            <div style={{
              width: "40px",
              height: "40px",
              background: "var(--accent-dim)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
            }}>
              <svg width="20" height="20" fill="var(--accent)" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 style={{
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "8px",
            }}>
              Histórico de Preços
            </h3>
            <p style={{
              fontSize: "14px",
              // color: "var(--text-secondary)",
            }}>
              Acompanha a evolução dos preços ao longo do tempo
            </p>
          </div>

          <div className="card">
            <div style={{
              width: "40px",
              height: "40px",
              background: "var(--accent-dim)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
            }}>
              <svg width="20" height="20" fill="var(--accent)" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <h3 style={{
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "8px",
            }}>
              Lista de Favoritos
            </h3>
            <p style={{
              fontSize: "14px",
              color: "var(--text-secondary)",
            }}>
              Guarda os teus itens favoritos para acesso rápido
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
