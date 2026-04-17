import express from "express";
import cors from "cors";
import gatosRoutes from "./routes/gatos.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use("/gatos", gatosRoutes);

app.listen(8800, () => {
    console.log("Servidor rodando na porta 8800");
});