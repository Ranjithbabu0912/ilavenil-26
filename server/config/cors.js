import cors from "cors";

const allowedOrigins = [
  "https://ilavenil-26.vercel.app",
  "http://localhost:5173",
];

const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow others, rely on auth
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // ✅ PATCH added
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204, // ✅ Vercel-friendly
});

export default corsMiddleware;
