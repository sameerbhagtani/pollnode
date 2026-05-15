import { connect } from "mongoose";

import env from "./env.js";

export async function connectDb() {
    await connect(env.MONGODB_URI);

    console.log("✅ Connected to MongoDB");
}
