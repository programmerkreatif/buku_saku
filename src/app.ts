import express from "express";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());

app.get("/api/hello", (req, res) => {
    res.json({
        success: true,
        message: "Node.js TypeScript API is running"
    });
});

app.use("/api/auth", authRoutes);

export default app;