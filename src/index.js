import express from "express";
import connect from "./db.js";
import cors from "cors";
import ExpressMongoSanitize from "express-mongo-sanitize";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import session from "express-session";
import { userRouter, postRouter } from "./routes/index.js";
import https from "https";
import http from "http";
import fs from "fs";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/uploads", express.static("uploads"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(ExpressMongoSanitize());
app.use(
  cors({
    origin: ["https://www.grinergy.co.kr"],
    credentials: true,
  })
);

const store = new MongoStore({
  mongoUrl: process.env.MONGO_URL,
  touchAfter: 24 * 60 * 60,
});

app.use(
  session({
    name: process.env.COOKIE_NAME || "SSID",
    secret: process.env.COOKIE_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    store,
    cookie: {
      httpOnly: true, // 변경 필요
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
const is_test = true;
let server = undefined;
const HTTP_PORT = 8001;
const HTTPS_PORT = 8443;
if (is_test) {
  server = http.createServer(app).listen(HTTP_PORT, function () {
    console.log("Server on " + HTTP_PORT);
  });
} else {
  const options = {
    // letsencrypt로 받은 인증서 경로를 입력해 줍니다.
    ca: fs.readFileSync("/etc/letsencrypt/live/grinergy.co.kr/fullchain.pem"),
    key: fs.readFileSync("/etc/letsencrypt/live/grinergy.co.kr/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/grinergy.co.kr/cert.pem"),
  };
  server = https.createServer(options, app).listen(HTTPS_PORT, function () {
    console.log("Server on " + HTTPS_PORT);
    //scheduleAlarm();
  });
}
