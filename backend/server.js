// backend/server.js
require('dotenv').config({ path: './.env' });
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.EXCHANGE_API_KEY;

app.use(cors());

// Endpoint for latest rates for a base currency
app.get('/api/rates/:base', async (req, res) => {
    try {
        const base = req.params.base.toUpperCase();

        const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${base}`);
        const data = await response.json();

        if (data.result === "error") {
            console.error("External API error:", data);
            return res.status(500).json({ error: "External API failed", details: data });
        }

        res.json(data);

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: 'Failed to fetch exchange rates' });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});