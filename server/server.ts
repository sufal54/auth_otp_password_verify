import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import next from "next";
import * as dotenv from "dotenv";
import { NextServer } from "next/dist/server/next";

import connectDB from "./db/db";

import user_router from "./router/user_auth_route";

const dev: boolean = true;
const app: NextServer = next({ dev });
const handel = app.getRequestHandler();
const server: Express = express();
const port: number = 80;

server.use(express.json());
server.use(cookieParser());

dotenv.config();

app.prepare().then(() => {
  server.use("/api/user", user_router);
  server.all("*", (req: Request, res: Response) => {
    return handel(req, res);
  });
  server.listen(port, () => {
    connectDB();
    console.log("server started");
  });
});
