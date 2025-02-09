require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware to enable CORS (Fixes the CORS error)
app.use(cors({
    origin: "*", // Allow all origins (for development) - You can restrict this later
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));

// ✅ Middleware to parse JSON request body
app.use(express.json());

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Connection Error:", err));

// ✅ Verify the connection and list collections
mongoose.connection.once("open", async () => {
    console.log("Connected to database:", mongoose.connection.db.databaseName);
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Available Collections:", collections.map(c => c.name));
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
        if (!washroom) return res.status(404).json({ message: "Washroom not found" });
        res.json(washroom);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ API Route to Update Washroom Status (For "Update Status" Button)
app.put("/washrooms/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body; // Contains pads, tampons, and waterFilter status

        // Find the washroom and update its floor details
        const washroom = await Washroom.findOneAndUpdate(
            { id: parseInt(id) },
            { $set: { "floors.$[].status": updateData } }, // Update status for all floors
            { new: true }
        );

        if (!washroom) return res.status(404).json({ message: "Washroom not found" });

        res.json({ message: "Washroom status updated successfully", washroom });
    } catch (err) {
        console.error("Error updating washroom:", err);
        res.status(500).json({ error: err.message });
    }
});

// ✅ Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
