import express, { type Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import authRoutes from "./modules/auth/routes.js";
import pollRoutes from "./modules/polls/routes.js";

import notFoundHandler from "./shared/middlewares/notFoundHandler.js";
import errorHandler from "./shared/middlewares/errorHandler.js";

import env from "./shared/config/env.js";

export default function createServerApplication(): Application {
    const app = express();

    app.use(express.json());
    app.use(cookieParser());

    app.use(
        cors({
            origin: env.CLIENT_URL,
            credentials: true,
        }),
    );

    app.use(clerkMiddleware());

    app.get("/api/ping", (req, res) => {
        return res.status(200).json({
            message: "PollNode is working",
        });
    });

    app.use("/api/auth", authRoutes);
    app.use("/api/polls", pollRoutes);

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}
