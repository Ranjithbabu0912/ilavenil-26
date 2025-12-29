import cors from "cors";

const allowedOrigins = [
  "https://ilavenil-26.vercel.app",
  "http://localhost:5173",
];

const corsMiddleware = cors({
  origin: (origin, callback) => {
    // allow browser, postman, server calls
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // 🔥 DO NOT BLOCK – allow but rely on auth instead
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

export default corsMiddleware;
