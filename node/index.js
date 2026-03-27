import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { coordinator } from "./agents/coordinator.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get("/ask", async (req, res) => {
    const query = req.query.query;
    if (!query) return res.json({ error: "Query parameter is required" });

    const response = await coordinator(query);
    res.json({ response });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));