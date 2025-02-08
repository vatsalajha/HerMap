require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Connection Error:", err));

// Report Schema
const ReportSchema = new mongoose.Schema({
    location: String,
    availability: String,
    comments: String,
    imageUrl: String,
    createdAt: { type: Date, default: Date.now }
});

const Report = mongoose.model("Report", ReportSchema);

// API Routes
app.post("/report", async (req, res) => {
    try {
        const newReport = new Report(req.body);
        await newReport.save();
        res.status(201).json({ message: "Report submitted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/reports", async (req, res) => {
    try {
        const reports = await Report.find();
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
