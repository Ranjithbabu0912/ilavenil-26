import express from "express";
import corsMiddleware from "./config/cors.js";
import eventRoutes from "./routes/eventRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminPaymentRoutes from "./routes/adminPaymentRoutes.js";
import qrAttendanceRoutes from './routes/qrAttendanceRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import adminAttendanceRoutes from "./routes/adminAttendanceRoutes.js";
import { fileURLToPath } from "url";
import path from "path";



const app = express();


app.use(corsMiddleware);

// app.use(corsMiddleware);
app.use(express.json());

app.use(express.urlencoded({ extended: true }));


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", qrAttendanceRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminPaymentRoutes);
app.use("/api", userRoutes);
app.use("/api/admin", adminAttendanceRoutes);



app.get("/", (_, res) => {
    res.send("API running");
});

export default app;








