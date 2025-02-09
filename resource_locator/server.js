require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ Middleware to enable CORS (Fixes the CORS error)
app.use(
  cors({
    origin: "*", // Allow all origins (for development) - You can restrict this later
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// ✅ Middleware to parse JSON request body
app.use(express.json());

// ✅ Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// ✅ Verify the connection and list collections
mongoose.connection.once("open", async () => {
  console.log("Connected to database:", mongoose.connection.db.databaseName);
  try {
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Available Collections:",
      collections.map((c) => c.name)
    );
  } catch (error) {
    console.error("Error listing collections:", error);
  }
});

// ✅ Define Schema for Washroom Locations
const WashroomSchema = new mongoose.Schema({
  id: Number,
  name: String,
  location: {
    lat: Number,
    lng: Number,
  },
  floors: [
    {
      level: String,
      accessibility: Boolean,
      vendingMachine: Boolean,
      status: {
        pads: String,
        tampons: String,
        lastUpdated: String,
        waterFilter: String,
      },
    },
  ],
});

// ✅ Create a Model
const Washroom = mongoose.model("Washroom", WashroomSchema, "HerMaps_Reports");

// ✅ Define Schema for Updates
const UpdateSchema = new mongoose.Schema({
  washroomId: Number,
  floor: String,
  status: {
    pads: String,
    tampons: String,
    waterFilter: String,
  },
  vendingMachine: Boolean,
  updatedBy: String, // Stores the name of the user who made the update
  timestamp: { type: Date, default: Date.now },
});

// ✅ Create an Update Model
const Update = mongoose.model("Update", UpdateSchema, "HerMaps_Updates");

app.get("/updates", async (req, res) => {
  try {
    const updates = await Update.find().sort({ timestamp: -1 }).limit(10);
    res.json(updates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/updates", async (req, res) => {
  try {
    const newUpdate = new Update(req.body);
    await newUpdate.save();
    res.status(201).json(newUpdate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ API Route to Fetch All Washroom Locations
app.get("/washrooms", async (req, res) => {
  try {
    const washrooms = await Washroom.find({});
    console.log("Fetched Washrooms:", washrooms);
    res.json(washrooms);
  } catch (err) {
    console.error("Error fetching washrooms:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ API Route to Fetch a Single Washroom by ID
app.get("/washrooms/:id", async (req, res) => {
  try {
    const washroom = await Washroom.findOne({ id: parseInt(req.params.id) });
    if (!washroom)
      return res.status(404).json({ message: "Washroom not found" });
    res.json(washroom);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/update-status", async (req, res) => {
  try {
    if (!req.body.id) {
      return res
        .status(400)
        .json({ error: "❌ Missing washroom ID in request." });
    }

    const washroomId = parseInt(req.body.id, 10);
    if (isNaN(washroomId)) {
      return res.status(400).json({ error: "❌ Invalid washroom ID format." });
    }

    const { floor, status, vendingMachine } = req.body;

    const washroom = await Washroom.findOneAndUpdate(
      { id: washroomId, "floors.level": floor },
      {
        $set: {
          "floors.$.status": status, // ✅ Updates status of specific floor
          "floors.$.vendingMachine": vendingMachine, // ✅ Updates vending machine status
        },
      },
      { new: true }
    );

    if (!washroom) {
      return res
        .status(404)
        .json({ message: "❌ Restroom or floor not found" });
    }

    res.json({ message: "✅ Restroom status updated successfully", washroom });
  } catch (err) {
    console.error("❌ Error updating washroom:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/config", (req, res) => {
  if (!process.env.API_KEY) {
    return res
      .status(500)
      .json({ error: "API_KEY is missing in environment variables" });
  }
  res.json({ apiKey: process.env.API_KEY });
});

// ✅ Start the Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
