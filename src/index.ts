import * as dotenv from "dotenv";
import express from "express";
import { z } from "zod";
import { db } from "./lib/db";
import { haversineDistance } from "./lib/util";

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

// GET /listSchools -- List all schools near the given coordinates
const listSchoolsSchema = z.object({
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});
app.get("/listSchools", async (req, res) => {
  const parsedData = listSchoolsSchema.safeParse(req.query);

  if (!parsedData.success) {
    res.status(400).json({ message: "Missing or invalid query" });
    return;
  }

  try {
    // Fetches all schools from the database, sorts them based on proximity to the user's location.
    const schools = await db.school.findMany({
      where: {
        // 0.1 is roughly 11.1 km
        latitude: {
          gte: parsedData.data.latitude - 0.1,
          lte: parsedData.data.latitude + 0.1,
        },
        // Varies with latitude:
        // 0.1 is Roughly 11.1 km at equator
        // Smaller toward the poles
        longitude: {
          gte: parsedData.data.longitude - 0.1,
          lte: parsedData.data.longitude + 0.1,
        },
      },
    });
    // Sorting Mechanism: Calculate and sort by the geographical distance between the user's coordinates and each school's coordinates.
    const sortedSchools = schools
      .map((school) => ({
        ...school,
        distance: haversineDistance(
          parsedData.data.latitude,
          parsedData.data.longitude,
          school.latitude,
          school.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
    res.status(200).json(sortedSchools);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
