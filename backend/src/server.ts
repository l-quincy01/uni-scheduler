import "dotenv/config";
import { createApp } from "./app.js";
import { connectMongo } from "#db/mongo.js";

const PORT = process.env.PORT ?? 3000;

async function startServer() {
  try {
    await connectMongo();

    const app = createApp();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
