import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB, { getDatabaseStatus } from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import { ensureDefaultAdmin } from "./services/adminBootstrapService.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    database: getDatabaseStatus(),
    message: "VisionCheck AI API Running"
  });
});

app.use("/api", resultRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal server error."
  });
});

async function startServer() {
  await connectDB();
  await ensureDefaultAdmin();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
