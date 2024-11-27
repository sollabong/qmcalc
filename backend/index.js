require('dotenv').config();
const express = require('express');
const QuineMcCluskey = require('./qmapp');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// API Endpoint
app.post('/minimize', (req, res) => {
    const { variables, minterms } = req.body;
    if (!variables || !minterms) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    const qm = new QuineMcCluskey(variables, minterms);
    const result = qm.minimize();
    res.json({ result });
});

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, 'build')));

// Fallback to index.html for React routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));