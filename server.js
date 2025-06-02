// Importing required modules
const express = require('express'); // Web framework for creating routes and handling HTTP
const fs = require('fs');           // File system module to read/write the JSON file

const app = express();              // Creating an Express application instance
const PORT = 3000;                  // Port number where server will run

// Middleware to parse JSON body from incoming requests
app.use(express.json());

// Serve static files (like index.html, CSS, JS) from 'public' folder
app.use(express.static('public'));

// Path to the JSON file where we'll store the modules data
const filePath = 'modules.json';

// Read the file contents if it exists, or initialize an empty object
let modules = {};
if (fs.existsSync(filePath)) {
  modules = JSON.parse(fs.readFileSync(filePath, 'utf-8')); // Load existing data into memory
}

// Helper function to save current in-memory modules to file
function saveModules() {
  fs.writeFileSync(filePath, JSON.stringify(modules, null, 2)); // Pretty print with 2-space indentation
}

// Route: GET /modules - fetch all stored modules
app.get('/modules', (req, res) => {
  console.log('GET /modules');
  console.log(JSON.stringify(modules, null, 2)); // Optional logging for debug
  res.json(modules); // Send JSON response to client
});

// Route: POST /modules - add a new resource to a week
app.post('/modules', (req, res) => {
  let { week, resource } = req.body; // Destructure week number and resource object from request

  // Normalize week: convert 1 => Week 1, "2" => Week 2, etc.
  if (typeof week === 'number' || !isNaN(Number(week))) {
    week = `Week ${week}`;
  } else if (!week.startsWith('Week ')) {
    week = `Week ${week}`;
  }

  // If week doesn't exist, create a new array
  if (!modules[week]) {
    modules[week] = [];
  }

  // Push new resource to the correct week's list
  modules[week].push(resource);

  // Save updated modules to file
  saveModules();

  // Respond to client with a success message
  res.json({ message: `Resource added to ${week}` });
});

// Route: DELETE /modules/:week/:title - delete a resource by week and title
app.delete('/modules/:week/:title', (req, res) => {
  const rawWeek = req.params.week;
  const titleToDelete = req.params.title;

  // Normalize week format same as in POST
  let week = rawWeek;
  if (typeof week === 'number' || !isNaN(Number(week))) {
    week = `Week ${week}`;
  } else if (!week.startsWith('Week ')) {
    week = `Week ${week}`;
  }

  // If the week doesn't exist, return 404
  if (!modules[week]) {
    return res.status(404).json({ message: `Week '${week}' not found` });
  }

  const before = modules[week].length; // Number of resources before deletion

  // Remove the resource with the matching title
  modules[week] = modules[week].filter(r => r.title !== titleToDelete);

  const after = modules[week].length; // Number of resources after deletion

  // If nothing was deleted, that means the title wasn't found
  if (before === after) {
    return res.status(404).json({ message: `Title '${titleToDelete}' not found in ${week}` });
  }

  // If that was the only resource in the week, remove the week
  if (after === 0) {
    delete modules[week];
  }

  // Save the updated data
  saveModules();

  // Respond with success
  res.json({ message: `Deleted '${titleToDelete}' from ${week}` });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
