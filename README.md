# Mini Course Content Fetcher

## About the Project

This is a simple course content management backend with a basic frontend interface.  
It allows users to **add**, **view**, and **delete** course resources grouped by weeks.  
Data is persisted in a JSON file on the server, simulating basic storage without a database.

---

## Technologies Used

- **Backend:** Node.js with Express.js  
- **Frontend:** Plain HTML, CSS, and JavaScript  
- **Data Storage:** JSON file on disk (`modules.json`)  
- **Testing Tools:** Postman or curl for API requests

---

## Backend Functionality

- **GET /modules**  
  Returns all stored modules with their resources as JSON.

- **POST /modules**  
  Adds a new resource to a specified week. If the week doesn't exist, it is created.  
  **Request body (JSON):**

  {
    "week": 1,
    "resource": {
      "title": "Resource Title",
      "type": "video|article",
      "url": "https://resource-url.com"
    }
  }

- **DELETE /modules/:week/:title**  
  Deletes a resource by title from a given week. If the last resource in a week is deleted, the week is removed.

---

## Frontend Functionality

- **Add Resource:** Fill the form with Title, Type (video/article), URL, and Week number, then submit to add a resource.
- **Show Modules:** Click the "Show All Modules" button to display all weeks and their resources.
- **Open Resource:** Each resource has a clickable link that opens the URL in a new tab.
- **Delete Resource:** Each resource has a red "Delete" button next to it to remove that resource.

The frontend communicates with the backend via fetch API calls and updates dynamically.

---

## How to Run

1. **Install dependencies:**

   npm install

2. **Start the server (with nodemon):**

   nodemon server.js

3. **Open frontend:**

   go to http://localhost:3000

---

## Testing with Frontend

- Use the form to add resources.
- Click "Show All Modules" to view current modules.
- Use the delete buttons to remove resources.
- Resources open in new tabs when clicking "Open Resource."

---

## Testing with Postman

### 1. GET all modules

- Method: GET  
- URL: `http://localhost:3000/modules`  
- No body required  
- Response: JSON of all modules and resources.

### 2. POST a new resource

- Method: POST  
- URL: `http://localhost:3000/modules`  
- Body (raw, JSON):

  {
    "week": 1,
    "resource": {
      "title": "Intro to Node",
      "type": "video",
      "url": "https://example.com/node-intro"
    }
  }

- Response: Confirmation message.

### 3. DELETE a resource

- Method: DELETE  
- URL format: `http://localhost:3000/modules/Week%201/Intro%20to%20Node`  
  (Replace spaces with `%20` or let Postman encode automatically)  
- No body required  
- Response: Confirmation message.

---

## Notes

- Week numbers are accepted as integers; backend converts to `Week X` format automatically.
- If deleting the last resource from a week, the week is removed.
- Data persists between server restarts by reading/writing to `modules.json`.
- Make sure the server (`nodemon server.js`) is running before using the frontend or Postman.

---

Thanks!
