// agents/notesAgent.js
import db from "../db/firestore.js";

export async function handleNotes(query) {
  let notes = [];

  if (typeof query === "string") {
    const q = query.toLowerCase();
    if (q.includes("note") || q.includes("remember")) {
      const noteText = query.replace(/note|remember/i, "").trim();
      if (noteText) notes.push(noteText);
    }
  }

  if (typeof query === "object" && query !== null) {
    if (Array.isArray(query.notes)) {
      notes = query.notes.map(n => n.title || JSON.stringify(n));
    } else if (query.note) {
      notes = [query.note.title || JSON.stringify(query.note)];
    }
  }

  if (notes.length === 0) return "Notes agent couldn't understand";

  const savedNotes = [];
  for (const n of notes) {
    await db.collection("notes").add({ note: n });
    savedNotes.push(n);
  }

  return `Note${savedNotes.length > 1 ? "s" : ""} saved: ${savedNotes.join(", ")}`;
}