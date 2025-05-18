import express from "express";
import connectToDb from "./db/Mongo.database.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import router from "./routes/index.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

const PORT = process.env.PORT || 5000;

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("Hello From the server");
});

app.use(errorMiddleware);

const startServer = async () => {
  try {
    await connectToDb();
    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT} ✅`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
