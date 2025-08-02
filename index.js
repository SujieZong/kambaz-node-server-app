import express from "express";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import cors from "cors";
import UserRoutes from "./Kambaz/Users/routes.js";
import "dotenv/config";
import session from "express-session";
const app = express();
cors({
  credentials: true,
  origin: process.env.NETLIFY_URL || "http://localhost:5173",
});
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.NODE_SERVER_DOMAIN,
  };
}
app.use(session(sessionOptions));
app.use(cors());
app.use(express.json());
UserRoutes(app);
Hello(app);
Lab5(app);
app.listen(process.env.PORT || 4000);
