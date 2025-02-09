require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Connection Error:", err));

mongoose.connection.on("open", async () => {
    console.log("Connected to database:", mongoose.connection.db.databaseName);
});

// ✅ Define Schema for Washroom Locations
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

// ✅ Create a Model
const Washroom = mongoose.model("Washroom", WashroomSchema, "HerMaps_Reports");

// ✅ API Route to Fetch All Washrooms
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
        if (!washroom) return res.status(404).json({ message: "Washroom not found" });
        res.json(washroom);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ API Route to Update Washroom Status
app.put("/update-status", async (req, res) => {
    try {
        const { id, floor, vendingMachine, status } = req.body;

        console.log("Received Update Request:", req.body); // Debugging

        // Find the correct washroom
        const washroom = await Washroom.findOne({ id: parseInt(id) });
        if (!washroom) return res.status(404).json({ message: "Washroom not found" });

        // Find the correct floor inside the washroom's floors array
        const floorIndex = washroom.floors.findIndex(f => f.level === floor);
        if (floorIndex === -1) return res.status(404).json({ message: "Floor not found" });

        // Update the specific floor's status
        washroom.floors[floorIndex].status = status;
        washroom.floors[floorIndex].vendingMachine = vendingMachine;

        // Save updated document
        await washroom.save();
        
        res.json({ message: "Washroom status updated successfully!" });
    } catch (err) {
        console.error("Error updating washroom:", err);
        res.status(500).json({ error: err.message });
    }
});

// ✅ Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
