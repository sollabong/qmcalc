const express = require('express');
const qmapp = require('./qmapp');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/minimize', (req, res) => {
    const { variables, minterms } = req.body;
    if (!variables || !minterms) {
        return res.status(400).json({ error: 'Invalid input' });
    }
    const result = qmapp.minimize(variables, minterms);
    res.json({ minimizedExpression: result });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));