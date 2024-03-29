/********************************************************************************
 * WEB422 – Assignment 2
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Ji Ho Nam Student ID: 1398172117 Date: Feb 02, 2024
 *
 * Published URL: https://bewildered-plum-leotard.cyclic.app/
 *
 ********************************************************************************/
// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const ListingsDB = require("./modules/listingsDB");

const path = require("path");

dotenv.config();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const db = new ListingsDB();

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.use(express.static(__dirname));

    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "index.html"));
    });

    app.listen(HTTP_PORT, () => {
      console.log(`Server is running on http://localhost:${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Add a new listing
app.post("/api/listings", async (req, res) => {
  try {
    const newListing = await db.addNewListing(req.body);
    res.status(201).json(newListing);
  } catch (error) {
    res.status(500).json({ error: "Failed to add a new listing." });
  }
});

// Get listings with optional filters
app.get("/api/listings", async (req, res) => {
  try {
    const { page, perPage, name } = req.query;
    const listings = await db.getAllListings(page, perPage, name);
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve listings." });
  }
});

// Get a specific listing by ID
app.get("/api/listings/:id", async (req, res) => {
  try {
    const listing = await db.getListingById(req.params.id);
    if (!listing) {
      res.status(404).json({ error: "Listing not found." });
    } else {
      res.json(listing);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve the listing." });
  }
});

// Update a listing by ID
app.put("/api/listings/:id", async (req, res) => {
  try {
    const result = await db.updateListingById(req.body, req.params.id);
    if (result.nModified === 0) {
      res.status(404).json({ error: "Listing not found or not modified." });
    } else {
      res.json({ message: "Listing updated successfully." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update the listing." });
  }
});

// Delete a listing by ID
app.delete("/api/listings/:id", async (req, res) => {
  try {
    const result = await db.deleteListingById(req.params.id);
    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Listing not found or not deleted." });
    } else {
      res.json({ message: "Listing deleted successfully." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the listing." });
  }
});
