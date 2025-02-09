require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors()); 
app.use(express.json());

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

mongoose.connection.on("open", async () => {
    console.log("✅ Connected to database:", mongoose.connection.db.databaseName);
});

// ✅ Schema for Washroom Locations
const WashroomSchema = new mongoose.Schema({
    id: Number,
    name: String,
    location: {
        lat: Number,
        lng: Number
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
                waterFilter: String
            }
        }
    ]
});

// Define the Update schema
const UpdateSchema = new mongoose.Schema({
    building: String,
    floor: String,
    timestamp: { type: Date, default: Date.now },
    changes: {
        pads: String,
        tampons: String,
        waterFilter: String,
        vendingMachine: Boolean
    }
});


const Update = mongoose.model("Update", UpdateSchema, "HerMaps_Updates");

// ✅ Create Model
const Washroom = mongoose.model("Washroom", WashroomSchema, "HerMaps_Reports");

// ✅ API Route: Fetch All Washrooms
app.get("/washrooms", async (req, res) => {
    try {
        const washrooms = await Washroom.find({});
        res.json(washrooms);
    } catch (err) {
        console.error("Error fetching washrooms:", err);
        res.status(500).json({ error: err.message });
    }
});

// ✅ API Route: Fetch a Single Washroom by ID
app.get("/washrooms/:id", async (req, res) => {
    try {
        const washroom = await Washroom.findOne({ id: parseInt(req.params.id) });
        if (!washroom) return res.status(404).json({ message: "Washroom not found" });
        res.json(washroom);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ API Route: Update Washroom Status
app.patch("/update-status", async (req, res) => {
    try {
        const { id, floor, vendingMachine, pads, tampons, waterFilter } = req.body;

        console.log("Request Body:", req.body);
        const washroom = await Washroom.findOne({ id: parseInt(id) });
        if (!washroom) {
            return res.status(404).json({ message: "Washroom not found" });
        }

        const floorIndex = washroom.floors.findIndex(f => f.level === floor);
        if (floorIndex === -1) {
            return res.status(404).json({ message: "Floor not found" });
        }
        console.log("Updating floor details with:", { vendingMachine, pads, tampons, waterFilter });
        washroom.floors[floorIndex].vendingMachine = vendingMachine;
        washroom.floors[floorIndex].status.pads = pads;
        washroom.floors[floorIndex].status.tampons = tampons;
        washroom.floors[floorIndex].status.waterFilter = waterFilter;
        washroom.floors[floorIndex].status.lastUpdated = new Date().toLocaleString();

        console.log("Updated Washroom:", washroom);

        await washroom.save();
        
        res.json({ message: "✅ Washroom status updated successfully!" });

    } catch (err) {
        console.error("❌ Error updating washroom:", err);
        res.status(500).json({ error: err.message });
    }
});

// Endpoint to store new updates
app.post("/updates", async (req, res) => {
    try {
        const update = new Update(req.body);
        await update.save();
        res.status(201).json(update);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint to fetch the 10 most recent updates
app.get("/updates", async (req, res) => {
    try {
        const updates = await Update.find().sort({ timestamp: -1 }).limit(10);
        res.json(updates);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));