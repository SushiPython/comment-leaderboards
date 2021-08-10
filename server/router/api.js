import express from "express";
import { main } from "../modules/api.js";

export const router = express.Router();

router.post("/main", async (req, res) => {
  res.status(200).send(await main(req.body));
});
