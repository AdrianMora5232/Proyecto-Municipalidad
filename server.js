const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock API Route
app.get('/api/data', (req, res) => {
  const dbPath = path.join(__dirname, 'db.json');
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading database' });
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/reports', (req, res) => {
  const dbPath = path.join(__dirname, 'db.json');
  const newReport = req.body;

  fs.readFile(dbPath, 'utf8', (err, data) => {
    let db = { reports: [] };
    if (!err && data) {
      try {
        db = JSON.parse(data);
        if (!db.reports) db.reports = [];
      } catch (e) {
        console.error("Error parsing DB", e);
      }
    }

    db.reports.push(newReport);

    fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error writing to database' });
      }
      res.status(201).json({ message: 'Report saved successfully' });
    });
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages/index.html'));
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});