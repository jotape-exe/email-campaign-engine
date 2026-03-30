
import { errorHandler } from "@/interfaces/http/middlewares/error-handler";
import { campaignRoutes } from "@/interfaces/http/routes/campaign.routes";
import cors from "cors";
import express from "express";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    return res.json({
        status: "ok",
    });
});

app.use("/api", campaignRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`[Start] Server running on port ${PORT}`);
});