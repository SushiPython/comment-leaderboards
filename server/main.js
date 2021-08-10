import express from "express";
import { config } from "./modules/lib.js";

const app = express();

import { router as apiRouter } from "./router/api.js";

app.use(express.json());
app.use("/api", apiRouter);

app.use("/", express.static("public"));

app.listen(config.port);
