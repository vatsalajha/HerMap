require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Connection Error:", err));

mongoose.connection.on("open", async () => {
    console.log("Connected to database:", mongoose.connection.db.databaseName);
});

mongoose.connection.once("open", async () => {
    try {
        const washrooms = await mongoose.connection.db.collection("HerMaps_Reports").find({}).toArray();
        console.log("Raw MongoDB Data:", washrooms);
    } catch (error) {
        console.error("Error fetching directly from MongoDB:", error);
    }
});



// Define Schema for Washroom Locations
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

// Create a Model
const Washroom = mongoose.model("Washroom", WashroomSchema, "HerMaps_Reports");

// ✅ **API Route to Fetch Washroom Locations**
app.get("/washrooms", async (req, res) => {
    try {
        const washrooms = await Washroom.find({});
        console.log("Fetched Washrooms:", washrooms);  // Debugging log
        res.json(washrooms);
    } catch (err) {
        console.error("Error fetching washrooms:", err);
        res.status(500).json({ error: err.message });
    }
});


// ✅ **API Route to Fetch a Single Washroom by ID**
app.get("/washrooms/:id", async (req, res) => {
    try {
        const washroom = await Washroom.findOne({ id: parseInt(req.params.id) });
        if (!washroom) return res.status(404).json({ message: "Washroom not found" });
        res.json(washroom);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
