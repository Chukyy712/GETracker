import express from "express";
import cors from "cors";
import priceRouter from "./routes/price.ts"

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/price", priceRouter); 

const PORT = 3001;

app.get("/", (req, res) => {
  res.send("Ja so falta 92% Rebelo.");
});

app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});

