import * as mongodb from "mongodb";
const MongoClient = mongodb.default.MongoClient;

import fs from "fs";

const config = JSON.parse(fs.readFileSync("config.json", "utf-8"));

const client = await MongoClient.connect(config.dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = await client.db(config.db);

export { db, config };
