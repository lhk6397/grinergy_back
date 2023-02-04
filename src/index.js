import express from "express";
import connect from "./db.js";
import cors from "cors";
import ExpressMongoSanitize from "express-mongo-sanitize";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import session from "express-session";
import { userRouter, postRouter } from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/uploads", express.static("uploads"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(ExpressMongoSanitize());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

const store = new MongoStore({
  mongoUrl: process.env.MONGO_URL,
  touchAfter: 24 * 60 * 60,
});

app.use(
  session({
    name: process.env.COOKIE_NAME || "session",
    secret: process.env.COOKIE_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    store,
    cookie: {
      httpOnly: false, // 변경 필요
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: false,
      // sameSite: "none",
      // domain 필요
    },
  })
);

app.use("/api/user", userRouter);
app.use("/api/post", postRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}!`);
  await connect();
});
