import express from "express";
import "dotenv/config";
import cors from 'cors'
import connectDB from "./config/db.js";
import eventRoutes from "./routes/eventRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

connectDB();

const app = express();
app.use(express.json());
app.use(cors())

app.use("/api/events", eventRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/uploads", express.static("uploads"));


app.get("/", (req, res) => {
    res.send("API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
);
