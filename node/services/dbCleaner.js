// services/dbCleaner.js
import db from "../db/firestore.js";

/**
 * Deletes all documents in the specified collections
 */
export async function cleanDB() {
  const collections = ["tasks", "notes", "calendar"];

  for (const col of collections) {
    const snapshot = await db.collection(col).get();
    const batch = db.batch();
    snapshot.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  }

  return "✅ Database cleaned: all tasks, notes, and events removed.";
}