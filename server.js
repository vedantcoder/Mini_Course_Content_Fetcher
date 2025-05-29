const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const filePath = 'modules.json';

// Read data from file or initialize empty
let modules = {};
if (fs.existsSync(filePath)) {
  modules = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Utility function to write to file
function saveModules() {
  fs.writeFileSync(filePath, JSON.stringify(modules, null, 2));
}

// GET /modules
app.get('/modules', (req, res) => {
  console.log('GET /modules');
  console.log(JSON.stringify(modules, null, 2));
  res.json(modules);
});

// POST /modules
app.post('/modules', (req, res) => {
  let { week, resource } = req.body;

  // Normalize the week value
  if (typeof week === 'number' || !isNaN(Number(week))) {
    week = `Week ${week}`;
  } else if (!week.startsWith('Week ')) {
    week = `Week ${week}`;
  }

  if (!modules[week]) {
    modules[week] = [];
  }

  modules[week].push(resource);
  saveModules();

  res.json({ message: `Resource added to ${week}` });
});

// DELETE /modules/:week/:title
app.delete('/modules/:week/:title', (req, res) => {
  const rawWeek = req.params.week;
  const titleToDelete = req.params.title;

  // Normalize week format
  let week = rawWeek;
  if (typeof week === 'number' || !isNaN(Number(week))) {
    week = `Week ${week}`;
  } else if (!week.startsWith('Week ')) {
    week = `Week ${week}`;
  }

  if (!modules[week]) {
    return res.status(404).json({ message: `Week '${week}' not found` });
  }

  const before = modules[week].length;
  modules[week] = modules[week].filter(r => r.title !== titleToDelete);
  const after = modules[week].length;

  if (before === after) {
    return res.status(404).json({ message: `Title '${titleToDelete}' not found in ${week}` });
  }

  // Remove the week entirely if no resources left
  if (after === 0) {
    delete modules[week];
  }

  saveModules();
  res.json({ message: `Deleted '${titleToDelete}' from ${week}` });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});