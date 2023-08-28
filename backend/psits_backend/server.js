import "express-async-errors";
import cors from "cors";
import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";

import config from "./src/utils/Config.js";
import database from "./src/MongoDB.js";

// routers
import v2AuthRouter from "./src/routes/authRouter.js";
import homeRouter from "./src/routes/main.js";
import authRouter from "./src/routes/auth.js";
import userRouter from "./src/routes/users.js";
import annoucementRouter from "./src/routes/announcement.js";
import eventRouter from "./src/routes/events.js";
import merchandiseRouter from "./src/routes/merchandise.js";
import orderRouter from "./src/routes/orders.js";
import officeLogRouter from "./src/routes/officelog.js";

// middleware
import { authenticateUser } from "./src/middlewares/authMiddleware.js";
import errorHandlerMiddleware from "./src/middlewares/errorHandlerMiddleware.js";

const app = express();

let PORT = config.PORT;

// run database
database();

// middlewares
app.use(cookieParser());
app.use(express.json()); // uses JSON as payload
app.use(compression()); // compresses all routes

// cors
app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

// routes
app.use("/", homeRouter);
app.use("/api/auth", authRouter);
app.use("/api/authv2", v2AuthRouter);
app.use("/api/user", userRouter);
app.use("/api/announcement", annoucementRouter);
app.use("/api/event", eventRouter);
app.use("/api/merch", merchandiseRouter);
app.use("/api/order", orderRouter);
app.use("/api/officelog", officeLogRouter);

// throw error in jason format if route does not exist
app.use("*", (req, res) => {
  res.status(404).json({ msg: "Route not found!" });
});

app.use(errorHandlerMiddleware);

// run the app
const server = app.listen(PORT, () => {
  console.log(`Server has started, running on port: ${PORT}`);
});

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
