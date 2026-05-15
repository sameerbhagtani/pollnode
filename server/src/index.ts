import http from "node:http";

import { connectDb } from "./shared/config/db.js";
import createServerApplication from "./app.js";
import createSocketServer from "./shared/socket/index.js";

import env from "./shared/config/env.js";

async function main() {
    try {
        await connectDb();

        const server = http.createServer(createServerApplication());
        createSocketServer(server);

        server.listen(env.PORT, () => {
            console.log(`✅ Server started on PORT: ${env.PORT}`);
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

main();
