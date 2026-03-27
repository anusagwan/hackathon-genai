// import { handleTask } from "./taskAgent.js";
// import { handleNotes } from "./notesAgent.js";
// import { handleCalendar } from "./calendarAgent.js";
// import { understandQuery } from "../services/gemini.js";

// /**
//  * Coordinator: routes queries to the appropriate agent(s)
//  * Supports both plain text queries and structured JSON from Gemini.
//  */
// export async function coordinator(query) {
//   let parsedQuery = query;
//   let responses = [];

//   try {
//     // Step 1: Ask Gemini to parse the query
//     const aiResult = await understandQuery(query);

//     // If AI returned structured data, use it
//     if (!aiResult.error && typeof aiResult === "object") {
//       parsedQuery = aiResult;
//     }

//   } catch (err) {
//     console.error("Coordinator: Gemini parsing failed:", err);
//     // fallback: use raw query string
//     parsedQuery = query;
//   }

//   // Step 2: Route to Task agent
//   const taskRes = await handleTask(parsedQuery);
//   if (taskRes) responses.push({ agent: "task", result: taskRes });

//   // Step 3: Route to Notes agent
//   const notesRes = await handleNotes(parsedQuery);
//   if (notesRes) responses.push({ agent: "notes", result: notesRes });

//   // Step 4: Route to Calendar agent
//   const calendarRes = await handleCalendar(parsedQuery);
//   if (calendarRes) responses.push({ agent: "calendar", result: calendarRes });

//   // Step 5: Fallback if no agent handled it
//   if (responses.length === 0) {
//     responses.push({ agent: "system", result: `Could not understand: '${query}'` });
//   }

//   return responses;
// }
import { handleTask } from "./taskAgent.js";
import { handleNotes } from "./notesAgent.js";
import { handleCalendar } from "./calendarAgent.js";
import { understandQuery } from "../services/gemini.js";
import { cleanDB } from "../services/dbCleaner.js"; // <-- new import

/**
 * Coordinator: routes queries to the appropriate agent(s)
 * Supports both plain text queries and structured JSON from Gemini.
 */
export async function coordinator(query) {
  // Step 0: Check for "clean db" command before routing
  const lowerQuery = typeof query === "string" ? query.toLowerCase() : "";
  if (lowerQuery.includes("clean db") || lowerQuery.includes("reset db")) {
    const result = await cleanDB();
    return [{ agent: "system", result }];
  }

  let parsedQuery = query;
  let responses = [];

  try {
    // Step 1: Ask Gemini to parse the query
    const aiResult = await understandQuery(query);

    // If AI returned structured data, use it
    if (!aiResult.error && typeof aiResult === "object") {
      parsedQuery = aiResult;
    }

  } catch (err) {
    console.error("Coordinator: Gemini parsing failed:", err);
    // fallback: use raw query string
    parsedQuery = query;
  }

  // Step 2: Route to Task agent
  const taskRes = await handleTask(parsedQuery);
  if (taskRes) responses.push({ agent: "task", result: taskRes });

  // Step 3: Route to Notes agent
  const notesRes = await handleNotes(parsedQuery);
  if (notesRes) responses.push({ agent: "notes", result: notesRes });

  // Step 4: Route to Calendar agent
  const calendarRes = await handleCalendar(parsedQuery);
  if (calendarRes) responses.push({ agent: "calendar", result: calendarRes });

  // Step 5: Fallback if no agent handled it
  if (responses.length === 0) {
    responses.push({ agent: "system", result: `Could not understand: '${query}'` });
  }

  return responses;
}