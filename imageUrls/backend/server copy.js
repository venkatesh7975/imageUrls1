const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary").v2; 
const cors = require("cors");

// Initialize express app
const app = express();

// Use CORS middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(
    "mongodb://localhost:27017/images"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// MongoDB Schema for Image URLs
const imageSchema = new mongoose.Schema({
  imageName: String,
  imageUrl: String,
});

const Image = mongoose.model("Image", imageSchema);

// POST Image with URL and Name Uploadzzzz
app.post("/images", upload.single("image"), async (req, res) => {
  try {
    console.log(req.file);
    const { originalname } = req.file; // Get the original file name
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log(result);

    const newImage = new Image({
      imageName: originalname, // Storing the original image file name
      imageUrl: result.secure_url, // Storing the image URL from Cloudinary
    });

    await newImage.save();
    res.status(201).json({ success: true, image: newImage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET all Images
app.get("/images", async (req, res) => {
  try {
    const images = await Image.find({});
    res.json(images);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start the server
app.listen(5001, () => console.log("Server running on port 5001"));
