const express = require('express');
const QuineMcCluskey = require('./qmapp');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/minimize', (req, res) => {
  const { variables, minterms } = req.body;
  if (!variables || !minterms) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const qm = new QuineMcCluskey(variables, minterms);
  const result = qm.minimize();
  res.json({ result });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
