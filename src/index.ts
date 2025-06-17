import * as dotenv from "dotenv";
import express from "express";

const app = express();

dotenv.config({
  path: ".env",
  override: false,
  debug: process.env.NODE_ENV === "development",
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
