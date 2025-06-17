import * as dotenv from "dotenv";
import express from "express";
import { z } from "zod";
import { db } from "./lib/db";

dotenv.config({
  path: ".env",
  override: false,
  debug: process.env.NODE_ENV === "development",
});

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// POST /addSchool -- Add a new school to the database
const addSchoolSchema = z.object({
  name: z.string().min(2).max(50),
  address: z.string().min(2),
  latitude: z.number(),
  longitude: z.number(),
});

app.post("/addSchool", async (req, res) => {
  const parsedData = addSchoolSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ message: "Missing or invalid data" });
    return;
  }
  try {
    await db.school.create({
      data: parsedData.data,
    });
    res.status(201).json({ message: "School added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
