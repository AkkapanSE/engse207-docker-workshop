const express = require('express');
const cors = require('cors');
const contactRoutes = require('./src/routes/contactRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/contacts', contactRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));