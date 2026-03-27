// agents/calendarAgent.js
import db from "../db/firestore.js";

export async function handleCalendar(query) {
  let events = [];

  if (typeof query === "string") {
    const cleanQuery = query.replace(/['"]/g, "").trim().toLowerCase();
    const keywords = ["meeting", "schedule", "appointment", "tomorrow", "next week"];
    if (keywords.some(word => cleanQuery.includes(word))) {
      events.push(query.replace(/['"]/g, "").trim());
    }
  }

  if (typeof query === "object" && query !== null) {
    if (Array.isArray(query.events)) {
      events = query.events.map(e => e.title || JSON.stringify(e));
    } else if (query.event) {
      events = [query.event.title || JSON.stringify(query.event)];
    }
  }

  if (events.length === 0) return "Calendar agent couldn't understand";

  const savedEvents = [];
  for (const ev of events) {
    await db.collection("events").add({ event: ev });
    savedEvents.push(ev);
  }

  return `Event${savedEvents.length > 1 ? "s" : ""} '${savedEvents.join(", ")}' scheduled`;
}