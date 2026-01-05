import { useState } from "react";

export default function Home() {
  const [item, setItem] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [error, setError] = useState("");

  const fetchPrice = async () => {
    setError("");
    setPrice(null);

    if (!item) {
      setError("Escreve o nome de um item!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/price/${encodeURIComponent(item)}`);
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro desconhecido");
        return;
      }

      const data = await res.json();
      setPrice(data.price);
    } catch (err) {
      setError("Não foi possível conectar ao servidor.");
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
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />
      <button onClick={fetchPrice} style={{ padding: "8px 16px" }}>
        Buscar preço
      </button>

      {price !== null && (
        <p style={{ marginTop: "20px", fontWeight: "bold" }}>
          Preço de {item}: {price.toLocaleString()} gp
        </p>
      )}

      {error && (
        <p style={{ marginTop: "20px", color: "red" }}>
          {error}
        </p>
      )}
    </div>
  );
}

