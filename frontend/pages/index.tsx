import { useState } from "react";
import SearchAutocomplete from "@/components/SearchAutocomplete";
import { ClipboardIcon, ChartIcon, StarIcon } from "@/components/Icons";
import { apiUrl, config } from "@/lib/config";

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
      const res = await fetch(apiUrl(config.endpoints.price(itemToSearch)));

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
            <div className="icon-box">
              <ClipboardIcon color="var(--accent)" />
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
            <div className="icon-box">
              <ChartIcon color="var(--accent)" />
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
            <div className="icon-box">
              <StarIcon color="var(--accent)" />
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
