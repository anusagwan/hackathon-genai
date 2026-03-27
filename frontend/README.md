Task: anything with "task", "add", "prepare", "do"
Notes: "note", "remember", "important", "save"
Calendar: "meeting", "schedule", "tomorrow"

http://localhost:5000/ask?query=clean%20db


Multi-Agent AI System

This project demonstrates a multi-agent AI system using Node.js, Google Gemini, and Firestore. The system can parse user queries into tasks, notes, and calendar events and handle them with specialized agents.

Features
Task Agent: Adds tasks to Firestore.
Notes Agent: Saves and retrieves notes.
Calendar Agent: Adds events to Firestore (supports Gemini-parsed events).
Gemini AI Integration: Parses natural language into structured tasks, notes, and events.
Multi-agent Coordination: Routes queries intelligently to the right agent(s).
REST API: Single /ask?query=... endpoint.


Prerequisites
Node.js v24+
Firebase project with Firestore
Google Gemini API access
Docker (optional for Cloud Run)


1. Clone the repository
git clone <your-repo-url>
cd hackathon-genai/node

2. Install dependencies
npm install

3.Setup environment variables
 create a .env file
 PORT=5000
GEMINI_API_KEY=YOUR_GEMINI_KEY
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY="your-firebase-private-key"  # Ensure proper escaping of line breaks

4.Project structure
.
├── index.js             # Express server
├── package.json
├── .env
├── db/
│   └── firestore.js     # Firestore initialization
├── agents/
│   ├── coordinator.js   # Routes queries to agents
│   ├── taskAgent.js
│   ├── notesAgent.js
│   └── calendarAgent.js
└── services/
    └── gemini.js        # Gemini AI integration

5. Local testing
 start the server
 node index.js

test queries in your browser

curl "http://localhost:5000/ask?query=add%20task%20finish%20report"
curl "http://localhost:5000/ask?query=note%20buy%20milk"
curl "http://localhost:5000/ask?query=schedule%20dentist%20appointment%20next%20week"

Responses are structured as JSON:
{
  "response": [
    {"agent": "task", "result": "Task 'finish report' added"},
    {"agent": "notes", "result": "Note saved: buy milk"},
    {"agent": "calendar", "result": "Event 'dentist appointment next week' scheduled"}
  ]
}

6. Using Gemini AI
services/gemini.js handles natural language parsing.
It converts free-text queries into structured objects:

{
  "tasks": ["finish report"],
  "notes": ["buy milk"],
  "events": [{"title":"dentist appointment","time":"next week"}]
}

Coordinator routes these objects to the appropriate agents.

7. Clean DB (optional)

Use Firestore Console or add a script to clear collections:

await db.collection("tasks").get().then(...); // delete all docs
await db.collection("notes").get().then(...);
await db.collection("events").get().then(...);

8. Deploy to Cloud Run (Optional)
Create Dockerfile in root:

FROM node:24
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]

9. Example Queries

| Query                                                                           | Expected Agents | Result                                          |
| ------------------------------------------------------------------------------- | --------------- | ----------------------------------------------- |
| `add task finish report`                                                        | task            | Task 'finish report' added                      |
| `note buy milk`                                                                 | notes           | Note saved: buy milk                            |
| `schedule dentist appointment next week`                                        | calendar        | Event 'dentist appointment next week' scheduled |
| `note buy milk, add task finish report, schedule dentist appointment next week` | all             | All three agents respond                        |
