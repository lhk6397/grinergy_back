import express from "express";
import cors from "cors";
import ExpressMongoSanitize from "express-mongo-sanitize";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import session from "express-session";
import https from "https";
import http from "http";
import fs from "fs";
import helmet from "helmet";
import morgan from "morgan";
import hpp from "hpp";

import connect from "./db.js";
import { userRouter, noticeRouter, newsRouter } from "./routes/index.js";
import errHandler from "./middleware/errHandler.js";

dotenv.config();
const app = express();
app.set("port", process.env.PORT || 8001);
const isTest = process.env.NODE_ENV === "production" ? false : true;

if (!isTest) {
  app.use(morgan("combined"));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(hpp());
} else {
  app.use(morgan("dev"));
}

app.disable("x-powered-by");
let server = undefined;

app.use("/uploads", express.static("uploads"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(ExpressMongoSanitize());
app.use(
  cors({
    origin: !isTest
      ? ["https://www.grinergy.co.kr", "https://www.grinergy.tech"]
      : "http://localhost:3000",
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
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: isTest ? false : true,
    },
  })
);

// ROUTER
app.use("/api/user", userRouter);
app.use("/api/notice", noticeRouter);
app.use("/api/news", newsRouter);

// 404 ERROR
app.use((req, res, next) => {
  const error = new ExpressError(
    `${req.method} ${req.url} 라우터가 없습니다.`,
    404
  );
  next(error);
});

// ERROR HANDLER
app.use(errHandler);

if (isTest) {
  await connect();
  server = http.createServer(app).listen(app.get("port"), function () {
    console.log("Server on " + app.get("port"));
  });
} else {
  await connect();
  const options = {
    // letsencrypt로 받은 인증서 경로를 입력해 줍니다.
    ca: fs.readFileSync("/etc/letsencrypt/live/grinergy.co.kr/fullchain.pem"),
    key: fs.readFileSync("/etc/letsencrypt/live/grinergy.co.kr/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/grinergy.co.kr/cert.pem"),
  };
  server = https
    .createServer(options, app)
    .listen(app.get("port"), function () {
      console.log("Server on " + app.get("port"));
    });
}
