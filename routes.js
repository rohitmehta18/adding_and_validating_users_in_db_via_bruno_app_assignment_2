const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./schema");

const router = express.Router();

// 🔹 Login Endpoint
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1️⃣ Validate Input
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // 2️⃣ Check if User Exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // 3️⃣ Compare Passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // 4️⃣ Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // ✅ Send Response
        res.json({ message: "Login successful", token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// 🔹 Register Route
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if all fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({ 
            username: name,  // Adjusted to match schema
            email, 
            password: hashedPassword 
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;


// 🔹 Get All Users (for testing purposes)
router.get("/getUsers", async (req, res) => {
    try {
        const users = await User.find({}, "-password"); // Exclude passwords for security
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;
