import express from "express";
import corsMiddleware from "./config/cors.js";
import eventRoutes from "./routes/eventRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminPaymentRoutes from "./routes/adminPaymentRoutes.js";
import qrAttendanceRoutes from './routes/qrAttendanceRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import adminAttendanceRoutes from "./routes/adminAttendanceRoutes.js";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";



const app = express();

const allowedOrigins = [
    "https://ilavenil-26.vercel.app",
    "http://localhost:5173"
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("CORS blocked"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);


app.use(cors());



app.use(corsMiddleware);
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








