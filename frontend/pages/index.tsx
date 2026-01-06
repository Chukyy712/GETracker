import { useState } from "react";

export default function Home() {
  const [item, setItem] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastSearchedItem, setLastSearchedItem] = useState("");

  const fetchPrice = async () => {
    setError("");
    setIsLoading(true);

    if (!item) {
      setError("Escreve o nome de um item!");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/price/${encodeURIComponent(item)}`);
      
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro desconhecido");
        setPrice(null); // Só limpa se der erro
        return;
      }

      const data = await res.json();
      setPrice(data.price);
      setLastSearchedItem(item);
    } catch (err) {
      setError("Não foi possível conectar ao servidor.");
      setPrice(null); // Só limpa se der erro
    } finally {
      setIsLoading(false);
    }
  };

  // Permite buscar com Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchPrice();
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", fontFamily: "sans-serif" }}>
      <h1>GE Tracker MVP</h1>
      <input
        type="text"
        placeholder="Nome do item..."
        value={item}
        onChange={(e) => setItem(e.target.value)}
        onKeyPress={handleKeyPress}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        disabled={isLoading}
      />
      <button 
        onClick={fetchPrice} 
        disabled={isLoading}
        style={{ 
          padding: "8px 16px",
          opacity: isLoading ? 0.6 : 1,
          cursor: isLoading ? 'wait' : 'pointer'
        }}
      >
        {isLoading ? 'A buscar...' : 'Buscar preço'}
      </button>

      {price !== null && (
        <div style={{ marginTop: "20px" }}>
          <p style={{ fontWeight: "bold", fontSize: "18px" }}>
            Preço de {lastSearchedItem}: {price.toLocaleString()} gp
          </p>
          {isLoading && (
            <p style={{ color: "#666", fontSize: "12px", fontStyle: "italic" }}>
              🔄 A atualizar...
            </p>
          )}
        </div>
      )}

      {error && (
        <p style={{ marginTop: "20px", color: "red" }}>
          {error}
        </p>
      )}
    </div>
  );
}
