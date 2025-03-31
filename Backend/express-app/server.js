const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test_coords"
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database.");
});

const createTableQuery = `CREATE TABLE IF NOT EXISTS coords_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  notes VARCHAR(255),
  lat DECIMAL(10,6) NOT NULL,
  lng DECIMAL(10,6) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX(lat),
  INDEX(lng)
)`;

db.query(createTableQuery, (err) => {
  if (err) {
    console.error("Error creating table:", err);
  } else {
    console.log("Table created successfully.");
  }
});

app.post("/api/coords", (req, res) => {
  const { notes, lat, lng } = req.body;
  
  if (!lat || !lng) {
    return res.status(400).json({ error: "Latitude and longitude are required." });
  }

  const query = "INSERT INTO coords_data (notes, lat, lng) VALUES (?, ?, ?)";
  db.query(query, [notes, lat, lng], (err, result) => {
    if (err) {
      console.error("Error inserting coordinates:", err);
      return res.status(500).json({ error: "Failed to save coordinates." });
    }
    res.status(201).json({ message: "Coordinates saved successfully!" });
  });
});

app.get("/coords", (req, res) => {
  db.query("SELECT * FROM coords_data ORDER BY created_at DESC", (err, results) => {
    if (err) {
      console.error("Error fetching coordinates:", err);
      return res.status(500).json({ error: "Failed to fetch coordinates." });
    }
    res.json(results);
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});